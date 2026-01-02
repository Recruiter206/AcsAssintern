

import React, { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import "./Register.css";

const Register = ({ closeModal }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const { registerUser } = useContext(AuthContext);

  const handler = async (e) => {
    e.preventDefault();
    const res = await registerUser(name, email, password, role);
    if (res.success) {
      // Close register modal & open login modal
      closeModal();
    } else {
      alert("Registration failed");
    }
  };

  return (
    <form className="register-form" onSubmit={handler}>
      <h2>Register</h2>
      <input type="text" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} required />
      <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Create password" value={password} onChange={e => setPassword(e.target.value)} required />
      <select value={role} onChange={e => setRole(e.target.value)} required>
        <option value="">Select Role</option>
        <option value="admin">Admin</option>
        <option value="employee">Employee</option>
      </select>
      <button type="submit">Register</button>
      <span className="lst" onClick={closeModal}>
        Already have an account? <span className="lsts">Login</span>
      </span>
    </form>
  );
};

export default Register;
