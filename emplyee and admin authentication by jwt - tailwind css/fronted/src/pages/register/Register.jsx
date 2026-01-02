

// import React, { useState, useContext } from "react";
// import { AuthContext } from "../auth/AuthContext";
// import "./Register.css";

// const Register = ({ closeModal }) => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("");
//   const { registerUser } = useContext(AuthContext);

//   const handler = async (e) => {
//     e.preventDefault();
//     const res = await registerUser(name, email, password, role);
//     if (res.success) {
//       // Close register modal & open login modal
//       closeModal();
//     } else {
//       alert("Registration failed");
//     }
//   };

//   return (
//     <form className="register-form" onSubmit={handler}>
//       <h2>Register</h2>
//       <input type="text" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} required />
//       <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
//       <input type="password" placeholder="Create password" value={password} onChange={e => setPassword(e.target.value)} required />
//       <select value={role} onChange={e => setRole(e.target.value)} required>
//         <option value="">Select Role</option>
//         <option value="admin">Admin</option>
//         <option value="employee">Employee</option>
//       </select>
//       <button type="submit">Register</button>
//       <span className="lst" onClick={closeModal}>
//         Already have an account? <span className="lsts">Login</span>
//       </span>
//     </form>
//   );
// };

// export default Register;
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const { registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handler = async (e) => {
    e.preventDefault();
    const res = await registerUser(name, email, password, role);
    if (res.success) {
      navigate("/login");
    } else {
      alert("Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center  h-screen bg-gray-100">
      <form
        onSubmit={handler}
        className="bg-white p-8 rounded-[1.25rem] shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center font-sans">Register</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 px-4 font-sans py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full font-sans mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full font-sans mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-4  font-sans px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="employee">Employee</option>
        </select>

        <button
          type="submit"
          className="w-full font-sans bg-green-500 text-white py-2 rounded hover:bg-green-600 transition mb-4"
        >
          Register
        </button>

        <p className="text-center text-gray-500 font-sans">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 underline font-sans">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
