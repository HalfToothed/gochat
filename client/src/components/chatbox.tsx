import { useEffect, useState } from "react";
import "../styles/chatbox.css";

export default function ChatBox({
  sender,
  selectedUser,
  messages,
  onSendMessage,
}: {
  sender: string;
  selectedUser: string;
  messages: string[];
  onSendMessage: (message: string) => void;
}) {
  const [message, setMessage] = useState(""); // State to store the current message
  const [parsedMessages, setParsedMessages] = useState<{ Sender: string; Text: string }[]>([]);

  // Parse incoming messages when they arrive
  useEffect(() => {
    const newParsedMessages = messages.map((msg) => {
      try {
        return JSON.parse(msg); // Parse the JSON message
      } catch (error) {
        console.error("Error parsing message:", error);
        return { Sender: "Unknown", Text: msg }; // If parsing fails, return a fallback
      }
    });

    // Append the new parsed messages to the existing ones
    setParsedMessages((prevMessages) => [...prevMessages, ...newParsedMessages]);
  }, [messages]); // Re-run effect whenever `messages` changes

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = { Sender: sender, Text: message };

      // Add the message to the UI immediately
      setParsedMessages((prevMessages) => [...prevMessages, newMessage]);

      // Send the message via WebSocket
      onSendMessage(JSON.stringify({ Sender: sender, Target: selectedUser, Text: message }));
      setMessage("");
    }
  };

  return (
    <div className="chat-box-container">
      <h2>Chat with {selectedUser}</h2>
      <div className="message-container">
        {parsedMessages.map((msg, index) => (
          <div key={index} className="message">
            <strong className="sender">{msg.Sender}</strong>:{" "}
            <span className="text">{msg.Text}</span>
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
