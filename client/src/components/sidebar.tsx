import { useState } from "react";
import "../styles/sidebar.css"

export default function Sidebar({ users, onSelectUser }: { users: string[]; onSelectUser: (username: string) => void }) {
  const [searchTerm, setSearchTerm] = useState("");

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
        .filter((user) => user.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((user, index) => (
          <li key={index} onClick={() => onSelectUser(user)}>
            {user}
          </li>
        ))}
    </ul>
  </div>
  );
}
