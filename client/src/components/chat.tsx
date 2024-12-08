import { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import ChatBox from "./chatbox";
import useWebSocket from "../hooks/websocket";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/chat.css";
import { Message, User } from "../model";


export default function Chat() {
  const location = useLocation();
  const user : User = location.state || "";
  const navigate = useNavigate();

  if(!user){
    navigate('/', { replace: true });
  }

  const api = import.meta.env.VITE_API;
  const socketUrl = import.meta.env.VITE_WEBSOCKET;

  const [selectedUser, setSelectedUser] = useState<User>();
  const [users, setUsers] = useState<User[]>([]);
  const [chats, setChats] = useState<Record<string, Message[]>>({});
  const [processedMessages, setProcessedMessages] = useState<Set<string>>(new Set());
  const { messages, sendMessage, isConnected } = useWebSocket(`${socketUrl}${user.Id}`);

  // Fetch users on component mount
  useEffect(() => {

    const token = localStorage.getItem("token") || "";

    const fetchUsers = async () => {
      try {
        
        const response = await fetch(`${api}/getAllUsers`,{
          method: "GET",
          headers: {
            "Authorization": token, // Pass the JWT token
            "Content-Type": "application/json",
          },
        });

         // Check if the response is unauthorized
        if (response.status === 401) {
          console.error("Unauthorized! Redirecting to login...");
          localStorage.removeItem("token"); // Clear invalid token
          localStorage.removeItem("user"); // Clear user data
          navigate("/"); // Redirect to the sign-in page
          return;
        }

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
  }, [api, user.Id]);

  useEffect(() => {

    const token = localStorage.getItem("token") || "";

    const fetchChatHistory = async () => {

      try{
        const response = await fetch(`${api}/getChatHistory`,{
          method: "GET",
          headers: {
            "Authorization": token, // Pass the JWT token
            "Content-Type": "application/json",
          },
        });

          // Check if the response is unauthorized
          if (response.status === 401) {
            console.error("Unauthorized! Redirecting to login...");
            localStorage.removeItem("token"); // Clear invalid token
            localStorage.removeItem("user"); // Clear user data
            navigate("/"); // Redirect to the sign-in page
            return;
          }

        if (response.ok) {
          const data = await response.json();

          const oldChats = data.reduce((acc: Record<string, Message[]>, message: Message) => {
            // Determine the chat key based on Sender and Target
            const chatKey = message.Sender === user.Id ? message.Target : message.Sender;
          
            // Add the message to the corresponding chat group
            acc[chatKey] = [...(acc[chatKey] || []), message];
            return acc;
          }, {});
          
          // Update the state with the new chats
          setChats((prevChats) => ({ ...prevChats, ...oldChats }));
        }
      }
      catch (error) {
        console.error("Request failed:", error);
      }
    };

    fetchChatHistory();

  }, [api]);

  // Process new messages
  useEffect(() => {
    const newMessages = messages.filter((rawMessage) => !processedMessages.has(rawMessage));

    if (newMessages.length === 0) return;

    newMessages.forEach((rawMessage) => {
      try {
        const parsedMessage: Message = JSON.parse(rawMessage);

        const chatUser =
          parsedMessage.Sender === user.Id
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
  }, [messages, user.Id, processedMessages]);

  // Send a message to the selected user
  const handleSendMessage = (text: string) => {
    if (!selectedUser) return;

    const newMessage: Message = { Sender: user.Id, Target: selectedUser.Id, Text: text };

    sendMessage(JSON.stringify(newMessage));

    // Optimistically update the chat
    setChats((prevChats) => ({
      ...prevChats,
      [selectedUser.Id]: [...(prevChats[selectedUser.Id] || []), newMessage],
    }));
  };

  return (
    <div className="chat-container">
      <div className="username">
          <p>{user.Username}</p>
      </div>
      <Sidebar users={users} onSelectUser={setSelectedUser} />
      {selectedUser ? (
        <ChatBox
          sender={user}
          selectedUser={selectedUser}
          messages={chats[selectedUser.Id] || []}
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
