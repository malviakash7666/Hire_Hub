import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { user, loading } = useAuth();

  if (loading) return <div />;

  // Not logged in
  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes((user as any).role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;