/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import "../styles/sidebar.css"
import { User } from "../model";

export default function Sidebar({ users, onSelectUser }: { users: User[]; onSelectUser: (User: User) => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<number[]>()

  const api = import.meta.env.VITE_API;

  useEffect(()=>{
    const fetchOnlineUsers = async () => {
      try {
        const response = await fetch(`${api}/getOnlineUsers`);
        if (response.ok) {
          const data = await response.json();
          setOnlineUsers(data);
        } else {
          console.error("Error fetching users:", response.statusText);
        }
      } catch (error) {
        console.error("Request failed:", error);
      }
    };

    fetchOnlineUsers();

    // Poll the server periodically for online users (optional)
    const interval = setInterval(fetchOnlineUsers, 5000); // every 5 seconds
    return () => clearInterval(interval); // cleanup on unmount

}, [api]);

  const handleSelectUser = (e:any, user:User) => {
    // Remove the "selected" class from all siblings
    const listItems = e.target.parentNode.children;
    for (const item of listItems) {
      item.classList.remove("selected-user");
    }
    // Add the "selected" class to the clicked item
    e.target.classList.add("selected-user");

    onSelectUser(user);
  };

  return (
    <div className="sidebar">
    <input
      type="text"
      placeholder="Search users"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <ul>
      {users
        .filter((user) => user.Username.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((user, index) => (
          <li key={index} onClick={(e) => handleSelectUser(e, user)}  className={onlineUsers?.includes(user.Id) ? "online" : ""}>
            {user.Username}
          </li>
        ))}
    </ul>
  </div>
  );
}
