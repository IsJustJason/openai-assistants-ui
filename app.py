from flask import Flask, render_template, request, jsonify
import openai, time, paramiko, json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Set OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

# Route to serve the index page
@app.route('/')
def index():
    return render_template('index.html')

# New Route to create a new thread
@app.route('/create_thread', methods=['GET'])
def create_thread():
    try:
        # Create a new chat thread
        thread = openai.beta.threads.create()
        return jsonify({"thread_id": thread.id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route to handle POST requests
@app.route('/ask', methods=['POST'])
def ask_openai():
    data = request.json
    thread_id = data.get('thread_id')
    user_input = data.get('input')
    user_files = data.get('file_ids')
    # Ensure user input is provided
    if not user_input and not user_files:
        return jsonify("No input provided"), 400
    if thread_id == 'None':
        return jsonify("No thread provided"), 400
    try:
        # Create message on thread
        thread_message = openai.beta.threads.messages.create(
        thread_id,
        role="user",
        content=user_input,
        file_ids=user_files
        )
        # Run assistant on thread
        run = openai.beta.threads.runs.create(
        thread_id=thread_id,
        assistant_id=os.environ.get('OPENAI_ASSISTANT_ID')
        )
        while run.status != 'completed': # TODO add check for failure and other statuses
            # Check run status
            print('Run Status: ' + run.status)
            run = openai.beta.threads.runs.retrieve(
            thread_id=thread_id,
            run_id=run.id
            )
            # If a function is required, run it and submit the output
            if run.status == 'requires_action':
                print(run.required_action.submit_tool_outputs.tool_calls)
                # Switch case for functions
                match run.required_action.submit_tool_outputs.tool_calls[0].function.name: # TODO add loop for parallel function calls, instead of assuming only one
                    case 'run_command': # Match for run_command function
                        args = json.loads(run.required_action.submit_tool_outputs.tool_calls[0].function.arguments) # Load arguments passed from the assistant
                        function_value = run_command(args['hostname'], args['command'])
                    case _:
                        function_value = 'Function does not exist'
                # Submit function output
                run = openai.beta.threads.runs.submit_tool_outputs(
                    thread_id=thread_id,
                    run_id=run.id,
                    tool_outputs=[
                        {
                            "tool_call_id": run.required_action.submit_tool_outputs.tool_calls[0].id,
                            "output": function_value,
                        }
                        ]
                    )
            time.sleep(.2)

        msgs = openai.beta.threads.messages.list(thread_id)
        #msgs.data[0].content[0].text.value

        return jsonify(msgs.data[0].content[0].text.value)
    except Exception as e:
        print(str(e))
        return jsonify(str(e)), 500

# Route to fetch thread messages
@app.route('/get_thread_messages', methods=['POST'])
def get_thread_messages():
    data = request.json
    thread_id = data.get('thread_id')

    if not thread_id:
        return jsonify("No thread ID provided"), 400

    try:
        # Fetch thread messages
        thread_messages = openai.beta.threads.messages.list(thread_id=thread_id)
        return jsonify(thread_messages.model_dump()['data'])
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@app.route('/upload_file', methods=['POST'])
def upload_file():
    list_files = []
    for uploaded_file in request.files.getlist('files'):
        print("Uploading file: " + uploaded_file.filename)
        try:
            # Read the file content
            file_content = uploaded_file.read()

            # Upload the file to OpenAI
            openai_file = openai.files.create(
                file=file_content,
                purpose="assistants"
            )

            list_files.append(openai_file.id)

            # Attach the file to the assistant
            # assistant_file = openai.beta.assistants.files.create(
            #     assistant_id="asst_abc123",  # Replace with your assistant's ID
            #     file_id=file_id
            # )
        except Exception as e:
            print(str(e))
            return jsonify({"error": str(e)}), 500
    return jsonify({"file_id": list_files}), 200


    
def run_command(hostname, command):
# Configuration variables
    username = os.environ.get('USERNAME_ENV_VAR')   # Replace with the SSH password
    password = os.environ.get('PASSWORD_ENV_VAR')   # Replace with the SSH username
          
    port = 22   # Replace with the SSH port if different from the default
    # Create the SSH client
    ssh_client = paramiko.SSHClient()
    # Automatically add the server's SSH key (not recommended for production use)
    ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    # Connect to the server
    try:
        ssh_client.connect(hostname, port, username, password)
        #print(f"Successfully connected to {hostname}")
        # Execute the uptime command
        stdin, stdout, stderr = ssh_client.exec_command(command)
        # Read the standard output and print it
        output = stdout.read().decode().strip()
        if output != "":           
          return (f"Success: {output}")
        else:
          output = stderr.read().decode().strip()
          return (f"Failure: {output}")
    except paramiko.AuthenticationException:
        print("Authentication failed, please verify your credentials.")
        return ("Authentication failed, please verify your credentials.")
    except paramiko.SSHException as sshException:
        print(f"Could not establish SSH connection: {sshException}")
        return (f"Could not establish SSH connection: {sshException}")
    except Exception as e:
        print(e)
    finally:
        # Close the SSH client
        ssh_client.close()

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
