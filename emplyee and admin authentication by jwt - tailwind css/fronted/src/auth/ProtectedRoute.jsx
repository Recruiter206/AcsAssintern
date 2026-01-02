
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoutes = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />; // not logged in
  if (role && user.role !== role) return <Navigate to="/" replace />; // wrong role

  return children;
};

export default ProtectedRoutes;
