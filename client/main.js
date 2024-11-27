const Input = {};

const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const username = document.getElementById("username");
const form = document.getElementById("input-form");

// Connect to WebSocket server

const ws = new WebSocket("ws://localhost:8080/ws");

ws.onerror = () =>{
  alert("We got some error, Reload the window");
}

ws.onclose = () => {
  alert("Connection failed, Reload the window");
}

// Handle form submission for text messages
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if(!username.value || username.value.trim() === ""){
    alert("Enter Username")
    return;
  }

  if(!messageInput.value){
    return;
  }

  Input.User = username.value;
  Input.Text = messageInput.value;

  let message = JSON.stringify(Input);

  try{
    if (message) {
      ws.send(message);
      messageInput.value = "";
    }
  }
  catch{
    alert("Something went wrong");
  }
 
});

ws.onmessage = (event) => {
  const newMessage = document.createElement("div");
  newMessage.classList.add("message");
  newMessage.textContent = event.data; // This should display the text
  messagesDiv.appendChild(newMessage);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
};