import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/signUp.css";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const api = import.meta.env.VITE_API;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${api}`+"/signUp", { email, username, password });
      if (response.status === 200) {
        navigate("/chat", { state: response.data.user }); // Pass to chat via state
      } else {
        alert("Sign-up failed!");
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      alert("Sign-up failed.");
    }
  };

  return (
    <div className="signup-container">
    <form className="signup-form" onSubmit={handleSignUp}>
      <h2>Sign Up</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Sign Up</button>
       <p>
        Already have an account? <a href="/">Sign In</a>
      </p>
    </form>
  </div>
  );
};

export default SignUp;
