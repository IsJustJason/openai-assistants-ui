# OpenAI Assistant Interface

This project is a web-based chat interface that allows users to interact with OpenAI's assistant API. It features a modern, responsive UI and includes functionalities like function calling, creating new chat threads, sending messages, and displaying AI responses. It was created to put the assistant function calling into practice and to provide a simple interface for users to interact with the API.

https://github.com/IsJustJason/openai-assistants-ui/assets/44307756/44dbde56-d223-4439-9bfc-6f44700da1ea

## Features

- Function calling.
- Create new chat threads.
- Send messages and receive assistant responses.
- Display conversation history.
- Modern and responsive user interface.

## TODO/Wishlist

- Asssitants picker
- Thread viewer/save with summary title
- File attachment to assistant
- Function calls get displayed in chat history
- Potential confirmation from user when running functions
- Secrets functionality for better authenication
- Microphone voice input(Work in Progress)
- Voice playback

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python Flask
- **API**: OpenAI's Assistant API

## Getting Started

### Prerequisites

- Python 3
- Flask
- Paramiko
- OpenAI API key

### Installation

#### Note
   The current repo contains a function that runs a command on a remote device. Your assistant must have this function in order for it to use it. The username and password environment vars are also needed only if you intend to use this function.

1. **Clone the Repository**

   ```bash
   git clone https://github.com/IsJustJason/openai-assistants-ui.git
   cd openai-assistants-ui

2. **Set Up a Virtual Environment (Optional but recommended)**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`

3. **Install Dependencies**
   ```bash
   pip install Flask openai paramiko

4. **Set Up Environment Variables**
   ```bash
   export OPENAI_API_KEY=your_api_key_here

   export OPENAI_ASSISTANT_ID=your_assistant_id_here

   export USERNAME_ENV_VAR=your_username_here

   export PASSWORD_ENV_VAR=your_password_here

5. **Setup Assistant and Functions**

   Build your assistant on the OpenAI website https://platform.openai.com/assistants

   Add Functions to it and then update the switch case in app.py to include your functions.

6. **Run the Application**
   ```bash
   python app.py

**Usage**
   
   Enter your prompt to your assistant and hit enter or click Send button.
   
   Your prompt will be sent to the AI and the AI's response will be displayed in the chat history.
   
   Any functions that are called will be ran and the AI response will be displayed in the chat history.
   
   Click the "New Chat" button to start a new chat thread and wipe history.
   
   Any errors or logs will be displayed in the browser console or field at the bottom of the page.

**Contributing**

   Contributions to this project are welcome! Please fork the repository and submit a pull request with your changes.

**License**

   This project is licensed under the MIT License.

**Acknowledgments**

   OpenAI for providing the Assistants API.
   All contributors who participate in this project.

## Docker

Run the following commands:

```
docker build --no-cache  -t web-app .
docker run -d -p 8000:8000 --name web-app web-app
docker logs -f web-app
```

Delete the container:

```
docker stop web-app && docker rm web-app
```