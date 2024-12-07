import { useEffect, useRef, useState } from "react";
import "../styles/chatbox.css";
import { Message, User } from "../model";

export default function ChatBox({
  sender,
  selectedUser,
  messages,
  onSendMessage,
}: {
  sender: User;
  selectedUser: User;
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
        <span>💬 {selectedUser.Username}</span>
      </div>
      <div className="message-container" ref={messageContainerRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.Sender === sender.Id ? "sent" : "received"}`}
          >
            {msg.Text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          className="input"
        />
        <button onClick={handleSendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
}
