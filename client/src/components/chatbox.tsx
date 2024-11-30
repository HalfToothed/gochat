import { useState } from "react";
import "../styles/chatbox.css";


type Message = {
  Sender: string;
  Target: string;
  Text: string;
};

export default function ChatBox({
  sender,
  selectedUser,
  messages,
  onSendMessage,
}: {
  sender: string;
  selectedUser: string;
  messages: Message[];
  onSendMessage: (message: string) => void;
}) {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage(""); // Clear the input after sending
    }
  };

  return (
    <div className="chat-box-container">
      <h2>Chat with {selectedUser}</h2>
      <div className="message-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.Sender === sender ? "sent" : "received"}`}
          >
            <strong>{msg.Sender === sender ? "Me" : msg.Sender}</strong>: {msg.Text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input"
        />
        <button onClick={handleSendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
}
