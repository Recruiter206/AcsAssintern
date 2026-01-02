
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoutes = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  // Wait until user state is loaded
  if (loading) return null; // or return <div>Loading...</div>;

  // Redirect if not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Redirect if role doesn't match
  if (role && user.role !== role) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoutes;
