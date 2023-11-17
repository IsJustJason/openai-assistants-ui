# OpenAI Assistant Interface

This project is a web-based chat interface that allows users to interact with OpenAI's assistant API. It features a modern, responsive UI and includes functionalities like function calling, creating new chat threads, sending messages, and displaying AI responses. It was created to put the assistant function calling into practice and to provide a simple interface for users to interact with the API.

## Features

- Function calling.
- Create new chat threads.
- Send messages and receive AI responses.
- Display conversation history.
- Modern and responsive user interface.

## TODO

Asssitants picker

Thread viewer/save with summary title

Format responses if they contain code blocks

File upload

Function calls get displayed in chat history

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
   OPENAI_API_KEY=your_api_key_here

   OPENAI_ASSISTANT_ID=your_assistant_id_here

   USERNAME_ENV_VAR=your_username_here

   PASSWORD_ENV_VAR=your_password_here

5. **Setup Assistant and Functions**

   Build your assistant on the OpenAI website https://platform.openai.com/assistants

   Add Functions to it and then update the switch case in app.py to include your functions.

6. **Run the Application**
   ```bash
   python app.py

**Usage**
   
   Enter your prompt to your assistant and hit enter or click Send button.
   
   Your prompt will be sent to the AI and the AI's response will be displayed in the chat history.
   
   Any functions that are called will be ran and the result will be displayed in the chat history.
   
   Click the "New Chat" button to start a new chat thread and wipe history.
   
   Any errors or logs will be displayed in the browser console or field at the bottom of the page.

**Contributing**

   Contributions to this project are welcome! Please fork the repository and submit a pull request with your changes.

**License**

   This project is licensed under the MIT License.

**Acknowledgments**

   OpenAI for providing the Assistants API.
   All contributors who participate in this project.

