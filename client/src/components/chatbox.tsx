import { useEffect, useRef, useState } from "react";
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
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

    // Automatically scroll to the bottom when messages change
    useEffect(() => {
      if (messageContainerRef.current) {
        messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
      }
    }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage(""); // Clear the input after sending
    }
  };

  return (
    <div className="chat-box-container">
      <div className="chat-header">
        <span>💬 {selectedUser}</span>
      </div>
      <div className="message-container" ref={messageContainerRef}>
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
