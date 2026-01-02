

import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (user) {
    // Redirect based on role
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "employee") return <Navigate to="/employee" replace />;
  }

  return children;
};

export default PublicRoute;
