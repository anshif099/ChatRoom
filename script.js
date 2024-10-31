let ws;
const storageKey = "userCredentials"; // Key for local storage

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Dummy authentication for demonstration
  const userCredentials = JSON.parse(localStorage.getItem(storageKey)) || {};

  // Check if user is trying to log in
  if (email && password) {
    if (userCredentials[email]) {
      // Check if the password matches the stored password
      if (userCredentials[email] === password) {
        // Successful login
        document.querySelector('.login-form').style.display = 'none';
        document.getElementById('chat').style.display = 'block'; // Show chat after login
        initializeWebSocket();
      } else {
        // Incorrect password
        alert('Incorrect password. Please try again.');
      }
    } else {
      // New user, save credentials
      userCredentials[email] = password; // Save the new user's email and password
      localStorage.setItem(storageKey, JSON.stringify(userCredentials));
      document.querySelector('.login-form').style.display = 'none';
      document.getElementById('chat').style.display = 'block'; // Show chat after login
      initializeWebSocket();
    }
  } else {
    alert('Please enter valid email and password');
  }
}

function initializeWebSocket() {
  // Initialize WebSocket after login
  ws = new WebSocket('ws://localhost:8080');

  ws.onmessage = (event) => {
    const messages = document.getElementById('messages');
    const message = document.createElement('div');
    message.classList.add('message');
    message.innerText = event.data;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight; // Auto-scroll to latest message
  };
}

function sendMessage() {
  const messageBox = document.getElementById('messageBox');
  const message = messageBox.value.trim();
  if (message && ws) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'self');  // Add 'self' class for styling
    messageDiv.innerText = message;
    document.getElementById('messages').appendChild(messageDiv);
    ws.send(message);
    messageBox.value = '';
    document.getElementById('messages').scrollTop = messages.scrollHeight;  // Auto-scroll to latest message
  }
}

// Add event listener for the Enter key
document.getElementById('messageBox').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();  // Prevent the default action (like a new line)
    sendMessage();
  }
});

// Check for saved credentials on page load
window.onload = () => {
  const userCredentials = JSON.parse(localStorage.getItem(storageKey)) || {};
  if (Object.keys(userCredentials).length > 0) {
    // If there are saved credentials, pre-fill the email field
    document.getElementById('email').value = Object.keys(userCredentials)[0]; // Get first saved email
    document.getElementById('password').focus(); // Focus on the password field
  }
};
