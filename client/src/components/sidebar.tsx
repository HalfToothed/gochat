import React, { useState } from "react";

interface SidebarProps {
  users: string[];
  onSelectUser: (username: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ users, onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredUsers = users.filter((user) =>
    user.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        {filteredUsers.map((user, index) => (
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
};

export default Sidebar;
