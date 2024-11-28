import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import ChatBox from "./chatbox";
import useWebSocket from "../hooks/websocket";

const Chat: React.FC = () => {

  const api = import.meta.env.VITE_API;
  const socket = import.meta.env.VITE_WEBSOCKET;

  const [selectedUser, setSelectedUser] = useState<string>("");
  const [users, setUsers] = useState<string[]>([]);
  const { messages, sendMessage, isConnected } = useWebSocket(socket);

   // Fetch users on component mount
   useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${api}` + '/getAllUsers'); 
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error('Error fetching users:', response.statusText);
        }
      } catch (error) {
        console.error('Request failed:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar users={users} onSelectUser={setSelectedUser} />
      {selectedUser ? (
        <ChatBox
          selectedUser={selectedUser}
          messages={messages}
          onSendMessage={sendMessage}
        />
      ) : (
        <div style={{ flex: 1, padding: "20px" }}>
          <h2>Select a user to start chatting</h2>
        </div>
      )}
      {!isConnected && <div style={{ position: "fixed", bottom: 10, right: 10 }}>Reconnecting...</div>}
    </div>
  );
};

export default Chat;