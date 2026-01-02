
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import "./Register.css";

const Login = ({ closeModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handler = async (e) => {
    e.preventDefault();
    const res = await loginUser(email, password);
    if (res.success) {
      closeModal(); // Close login modal
      if (res.role === "admin") navigate("/admin");
      else if (res.role === "employee") navigate("/employee");
    } else {
  
      
    }
  };

  return (
    <form className="login-form" onSubmit={handler}>
      <h2>Login</h2>
      <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
      <span className="lst" onClick={closeModal}>
        Don’t have an account? <span className="lsts">Register</span>
      </span>
    </form>
  );
};

export default Login;
