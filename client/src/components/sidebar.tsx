/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import "../styles/sidebar.css"
import { User } from "../model";

export default function Sidebar({ users, onSelectUser }: { users: User[]; onSelectUser: (User: User) => void }) {
  const [searchTerm, setSearchTerm] = useState("");

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
          <li key={index} onClick={(e) => handleSelectUser(e, user)}>
            {user.Username}
          </li>
        ))}
    </ul>
  </div>
  );
}
