import { useState } from "react";

export default function Sidebar({ users, onSelectUser }: { users: string[]; onSelectUser: (username: string) => void }) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div style={{ width: "250px", borderRight: "1px solid #ddd" }}>
      <input
        type="text"
        placeholder="Search users"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: "100%", padding: "5px" }}
      />
      <ul style={{ listStyle: "none", padding: 0 }}>
        {users
          .filter((user) => user.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((user, index) => (
            <li
              key={index}
              style={{ cursor: "pointer", padding: "10px" }}
              onClick={() => onSelectUser(user)}
            >
              {user}
            </li>
          ))}
      </ul>
    </div>
  );
}
