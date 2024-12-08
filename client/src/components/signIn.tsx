/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/signIn.css";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const api = import.meta.env.VITE_API;

  useEffect(()=>{
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
   // Check if token and user are present and valid
   if (token && userString) {
    try {
      const user = JSON.parse(userString); // Try parsing user
      if (user && typeof user === 'object') {
        console.log(user);
        console.log("Token already present, redirecting to chat...");
        navigate("/chat", { state: user }); // Pass to chat via state
        return;
      } else {
        console.error("Invalid user data format");
        localStorage.removeItem("token"); // Remove invalid token
        localStorage.removeItem("user");  // Remove invalid user
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("token"); // Remove invalid token
      localStorage.removeItem("user");  // Remove invalid user
    }
  }
  })


  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); 
    try {
      const response = await axios.post(`${api}` + "/signIn", { email, password });
      if (response.status === 200) { 
          const { token, user } = response.data; 
          // Save the token for later API requests
          localStorage.setItem("token", token);
          localStorage.setItem("user",JSON.stringify(user))

          navigate("/chat", { state: user }); // Pass to chat via state
      }  else {
        alert("Invalid credentials");
      }
    } catch (error) { 
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
        Don't have an account? <a href="/auth">Sign Up</a>
      </p>
    </form>
  </div>
  );
};

export default SignIn;
