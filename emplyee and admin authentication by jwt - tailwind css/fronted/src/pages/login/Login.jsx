
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handler = async (e) => {
    e.preventDefault();
    const res = await loginUser(email, password);
    if (res.success) {
      if (res.role === "admin") navigate("/admin");
      else if (res.role === "employee") navigate("/employee");
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handler}
        className="bg-white p-8 rounded-[1.25rem] shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center font-sans">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full font-sans mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full font-sans mb-4 mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mb-4"
        >
          Login
        </button>
        <p className="text-center text-gray-500">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 underline font-sans">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
