/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/signIn.css";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const api = import.meta.env.VITE_API;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${api}` + "/signIn", { email, password });
      if (response.status === 200) {
        navigate("/chat", { state: response.data.username }); // Pass to chat via state
      }  else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert("Sign-in failed.");
    }
  };

  return (
    <div className="signin-container">
    <form className="signin-form" onSubmit={handleSignIn}>
      <h2>Sign In</h2>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Sign In</button>
      <p>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
    </form>
  </div>
  );
};

export default SignIn;
