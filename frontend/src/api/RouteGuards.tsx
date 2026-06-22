import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const getRoleHome = (role: string) => {
  switch (role) {
    case "job_poster":
    case "admin":
      return "/dashboard/jobs";
    case "job_seeker":
      return "/dashboard";
    default:
      return "/";
  }
};

export function GuestRoute({ children }: Props) {
  const { user, loading } = useAuth();
  if (loading) return <div />;
  if (user) return <Navigate to={getRoleHome((user as any).role)} replace />;
  return <>{children}</>;
}

export function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, loading } = useAuth();
  if (loading) return <div />;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes((user as any).role))
    return <Navigate to={getRoleHome((user as any).role)} replace />;
  return <>{children}</>;
}