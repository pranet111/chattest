document.addEventListener('DOMContentLoaded', () => {
  // Get references to the login form, chat form, and chat window
  const loginForm = document.querySelector('#login-form');
  const chatForm = document.querySelector('#chat');
  const chatWindow = document.querySelector('#chat-window');
  const messageElement = document.querySelector('#message');

  // Set up event listeners for the login and chat forms
  loginForm.addEventListener('submit', handleLogin);
  chatForm.addEventListener('submit', handleChat);

  // Function to handle the login form submission
  function handleLogin(event) {
    event.preventDefault();

    // Get the username and password from the form
    const username = event.target.elements.username.value;
    const password = event.target.elements.password.value;

    // Send a POST request to the server to log in
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          // If there was an error, display it to the user
          messageElement.textContent = data.error;
        } else {
          // If the login was successful, hide the login form and show the chat form
          loginForm.style.display = 'none';
          chatForm.style.display = 'block';
          chatWindow.style.display = 'block';
        }
      });
  }

  // Function to handle the chat form submission
  function handleChat(event) {
    event.preventDefault();

    // Get the message from the form
    const message = event.target.elements.message.value;

    // Send a POST request to the server to send the message
    fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });

    // Clear the form and focus on it again
    event.target.elements.message.value = '';
    event.target.elements.message.focus();
  }

  // Connect to the server using SSE (Server-Sent Events)
  const eventSource = new EventSource('/stream');

  // Set up an event listener for incoming messages
  eventSource.addEventListener('message', event => {
    // Add the incoming message to the chat window
    const message = JSON.parse(event.data);
    chatWindow.innerHTML += `<p><strong>${message.username}:</strong> ${message.text}</p>`;

    // Scroll the chat window to the bottom
    chatWindow.scrollTop = chatWindow.scrollHeight;
  });
});
