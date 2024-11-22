const Input = {};

const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const username = document.getElementById("username");
const form = document.getElementById("input-form");

// Connect to WebSocket server
const ws = new WebSocket("wss://gochat-av01.onrender.com/ws");

// Handle form submission for text messages
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if(!username.value || username.value.trim() === ""){
    alert("Enter Username");
    return;
  }

  if(!messageInput.value){
    return;
  }

  Input.User = username.value;
  Input.Text = messageInput.value;

  let message = JSON.stringify(Input);

  if (message) {
    ws.send(message);
    messageInput.value = "";
  }
});

ws.onmessage = (event) => {
  const newMessage = document.createElement("div");
  newMessage.classList.add("message");
  newMessage.textContent = event.data; // This should display the text
  messagesDiv.appendChild(newMessage);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
};