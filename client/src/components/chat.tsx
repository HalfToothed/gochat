import { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import ChatBox from "./chatbox";
import useWebSocket from "../hooks/websocket";
import { useLocation } from "react-router-dom";
import "../styles/chat.css";

type Message = {
  Sender: string;
  Target: string;
  Text: string;
};

export default function Chat() {
  const location = useLocation();
  const username = location.state || "";

  const api = import.meta.env.VITE_API;
  const socketUrl = import.meta.env.VITE_WEBSOCKET;

  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState<string[]>([]);
  const [chats, setChats] = useState<Record<string, Message[]>>({});
  const [processedMessages, setProcessedMessages] = useState<Set<string>>(new Set());
  const { messages, sendMessage, isConnected } = useWebSocket(`${socketUrl}${username}`);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${api}/getAllUsers/${username}`);
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error("Error fetching users:", response.statusText);
        }
      } catch (error) {
        console.error("Request failed:", error);
      }
    };

    fetchUsers();
  }, [api, username]);

  // Process new messages
  useEffect(() => {
    const newMessages = messages.filter((rawMessage) => !processedMessages.has(rawMessage));

    if (newMessages.length === 0) return;

    newMessages.forEach((rawMessage) => {
      try {
        const parsedMessage: Message = JSON.parse(rawMessage);

        const chatUser =
          parsedMessage.Sender === username
            ? parsedMessage.Target // Outgoing
            : parsedMessage.Sender; // Incoming

        setChats((prevChats) => ({
          ...prevChats,
          [chatUser]: [...(prevChats[chatUser] || []), parsedMessage],
        }));

        // Add the message to the processed set
        setProcessedMessages((prevSet) => new Set(prevSet).add(rawMessage));
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });
  }, [messages, username, processedMessages]);

  // Send a message to the selected user
  const handleSendMessage = (text: string) => {
    if (!selectedUser) return;

    const newMessage: Message = { Sender: username, Target: selectedUser, Text: text };

    sendMessage(JSON.stringify(newMessage));

    // Optimistically update the chat
    setChats((prevChats) => ({
      ...prevChats,
      [selectedUser]: [...(prevChats[selectedUser] || []), newMessage],
    }));
  };

  return (
    <div className="chat-container">
      <div className="username">
          <p>{username}</p>
      </div>
      <Sidebar users={users} onSelectUser={setSelectedUser} />
      {selectedUser ? (
        <ChatBox
          sender={username}
          selectedUser={selectedUser}
          messages={chats[selectedUser] || []}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <div className="chatbox">
          <h2>Select a user to start chatting</h2>
        </div>
      )}
      {!isConnected && (
        <div className="reconnecting-message">
          <i className="fa fa-spinner fa-spin"></i> Reconnecting...
        </div>
      )}
    </div>
  );
}
