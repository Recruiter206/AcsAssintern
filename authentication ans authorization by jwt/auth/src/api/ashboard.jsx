import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { token, logout } = useContext(AuthContext);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/auth/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage(data.message);
      } catch (err) {
        setMessage(err.response?.data?.message || err.message);
      }
    };

    fetchDashboard();
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">{message}</h1>
      <button
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
