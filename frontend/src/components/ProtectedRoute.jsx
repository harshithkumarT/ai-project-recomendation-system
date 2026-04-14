import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

function ProtectedRoute({ children, allow = true }) {
  const { isAuthenticated, booting } = useAuth();

  if (booting) {
    return <div className="mx-auto mt-16 max-w-2xl text-center">Authenticating...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allow) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
