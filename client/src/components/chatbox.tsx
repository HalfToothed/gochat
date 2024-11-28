import React, { useState } from "react";

interface ChatBoxProps {
  selectedUser: string;
  messages: string[];
  onSendMessage: (message: string) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ selectedUser, messages, onSendMessage }) => {
  const [message, setMessage] = useState<string>("");

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(JSON.stringify({ to: selectedUser, message }));
      setMessage("");
    }
  };

  return (
    <div style={{ flex: 1, padding: "10px" }}>
      <h2>Chat with {selectedUser}</h2>
      <div
        style={{
          height: "300px",
          overflowY: "scroll",
          border: "1px solid #ddd",
          marginBottom: "10px",
          padding: "5px",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "calc(100% - 50px)", marginRight: "10px" }}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatBox;
