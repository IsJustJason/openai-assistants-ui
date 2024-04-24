window.onload = function () {
    document.getElementById('user-input').focus();
};

let currentThreadId = null; // Variable to store the current thread ID

function showLoadingOnButton() {
    const sendButton = document.getElementById('send-btn');
    sendButton.innerHTML = '<div class="loader"></div>'; // Replace button text with loader
    sendButton.disabled = true; // Disable the button
}

function hideLoadingOnButton() {
    const sendButton = document.getElementById('send-btn');
    sendButton.innerHTML = 'Send'; // Restore button text
    sendButton.disabled = false; // Enable the button
}

// Function to send user input to the backend
function sendUserInput(threadId, userInput) {
    // Show loading indicator while waiting for the response
    showLoadingOnButton();
    // Immediately display the user's message in the chat history
    addToChatHistory('User', userInput);

    fetch('/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: userInput, thread_id: threadId }),
    })
        .then(response => response.json())
        .then(data => {
            hideLoadingOnButton(); // Hide loading indicator when data is received
            // document.getElementById('logs').innerText = data;
            addToChatHistory('Assistant', data); // Add assistant's response to the chat history
        })
        .catch((error) => {
            hideLoadingOnButton();
            console.error('Error:', error);
            document.getElementById('logs').innerText = 'Error sending message.';
        });
}

function formatMessage(message) {
    // Replace spaces with &nbsp; and newlines with <br>
    return message.replace(/ /g, '&nbsp;').replace(/\n/g, '<br>');
}

// Function to add messages to the chat history
function addToChatHistory(role, message) {
    const messagesContainer = document.getElementById('messages-container');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message');
    if (role === 'Assistant') {
        message = formatAssistantResponse(message); // Format the message if it's from the assistant
    }
    else if (role === 'User') {
        message = formatMessage(message);
    }
    let roleClass = role === 'User' ? 'User' : 'Assistant';
    messageDiv.innerHTML = `<strong class="${roleClass}">${role}</strong>: ${message}`;
    messagesContainer.appendChild(messageDiv);
    // Scroll to the latest message
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function adjustLayout() {
    var chatHistory = document.getElementById('chat-history');
    var inputArea = document.getElementById('input-area');

    if (chatHistory.scrollHeight > window.innerHeight) {
        inputArea.style.position = 'static';
    } else {
        inputArea.style.position = 'sticky';
    }
}

// Call adjustLayout whenever new messages are added or the window is resized
window.addEventListener('resize', adjustLayout);

document.getElementById('send-btn').addEventListener('click', function () {
    var userInputField = document.getElementById('user-input');
    var userInput = userInputField.value;
    if (!userInput) {
        return; // If no user input and no files, do nothing
    }
    // var threadDisplayText = document.getElementById('thread-id').innerText; 
    // var threadId = threadDisplayText.includes("None") ? "" : threadDisplayText.split(": ")[1];
    var threadId = currentThreadId; // Get the current thread ID

    if (!threadId) {
        // If no thread ID, create a new thread first
        fetch('/create_thread')
            .then(response => response.json())
            .then(data => {
                if (data.thread_id) {
                    // document.getElementById('thread-id').innerText = `Thread ID: ${data.thread_id}`;
                    currentThreadId = data.thread_id;
                    sendUserInput(data.thread_id, userInput);
                } else {
                    document.getElementById('logs').innerText = 'Error creating thread';
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                document.getElementById('logs').innerText = 'Error creating thread';
            });
    } else {
        sendUserInput(currentThreadId, userInput);
    }

    // Clear the user input field after the message has been sent
    userInputField.value = '';
});


document.getElementById('user-input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default action (new line)
        document.getElementById('send-btn').click(); // Trigger the send button click
    }
});

document.getElementById('new-thread-btn').addEventListener('click', function () {
    fetch('/create_thread')
        .then(response => response.json())
        .then(data => {
            if (data.thread_id) {
                currentThreadId = data.thread_id; // Update the thread ID in JavaScript
                // Clearing out the user input, response area, and thread history
                document.getElementById('user-input').value = '';
                document.getElementById('messages-container').innerHTML = '';
            } else {
                document.getElementById('thread-id').innerText = 'Thread ID: Error creating thread';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            document.getElementById('thread-id').innerText = 'Thread ID: Error';
        });
});

function fetchThreadMessages(threadId) {
    fetch('/get_thread_messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ thread_id: threadId }),
    })
        .then(response => response.json())
        .then(data => {
            const messagesContainer = document.getElementById('messages-container');
            messagesContainer.innerHTML = ''; // Clear previous messages
            if (data && Array.isArray(data)) {
                data.reverse().forEach(message => { // Reversing the array
                    const messageDiv = document.createElement('div');
                    const role = message.role; // Role of the message sender
                    const content = message.content[0].text.value; // Assuming first element in content array is the message

                    messageDiv.innerHTML = `<strong>${role}:</strong> ${content}`;
                    messagesContainer.appendChild(messageDiv);
                });
            } else {
                messagesContainer.innerText = 'No messages found or error fetching messages.';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            document.getElementById('messages-container').innerText = 'Error fetching messages.';
        });
}


function formatAssistantResponse(responseText) {
    // First, replace triple backtick blocks with <pre><code> tags
    let formattedText = responseText.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');

    // Then, replace single backticks with <code> tags for inline code
    // Ensure we don't touch already replaced triple backticks code blocks
    formattedText = formattedText.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Convert line breaks to <br> tags for the remaining text
    formattedText = formattedText.replace(/\n/g, '<br>');

    return formattedText;
}
