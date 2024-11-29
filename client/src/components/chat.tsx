import { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import ChatBox from "./chatbox";
import useWebSocket from "../hooks/websocket";
import { useLocation } from "react-router-dom";

export default function Chat() {

  const location = useLocation();
  const username = location.state || "";

  const api = import.meta.env.VITE_API;
  const socketUrl = import.meta.env.VITE_WEBSOCKET;

  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState<string[]>([]);
  const { messages, sendMessage, isConnected } = useWebSocket(socketUrl + `${username}`);

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
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar users={users} onSelectUser={setSelectedUser} />
      {selectedUser ? (
        <ChatBox sender = {username} selectedUser={selectedUser} messages={messages} onSendMessage={sendMessage} />
      ) : (
        <div style={{ flex: 1, padding: "20px" }}>
          <h2>Select a user to start chatting</h2>
        </div>
      )}
      {!isConnected && (
        <div style={{ position: "fixed", bottom: 10, right: 10 }}>Reconnecting...</div>
      )}
    </div>
  );
}
