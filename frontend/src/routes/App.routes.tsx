import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/Public/HomePage";
import LoginPage from "../auth/LoginPage";
import SignupPage from "../auth/SignupPage";
import JobPostDashboardPage from "../pages/dashbord/JobPostDashboardPage";
import RecruiterApplicantsPage from "../pages/jobPoster/RecruiterApplicantsPage";
import JobSeekerDashboardPage from "../pages/dashbord/JobSeekerDashboardPage";
import JobDetailPage from "../pages/JobDetailPage";
import ProtectedRoute from "./Protected.routes";
import JobsPage from "../pages/jobPoster/JobsPage";
import CompaniesPage from "../pages/Public/CompaniesPage";
import { useAuth } from "../hooks/useAuth";

const App = () => {
  const { user, loading } = useAuth();

  const getRedirectForRole = (r: any) => {
    if (!r) return "/";
    if (r === "job_poster" || r === "admin") return "/dashboard";
    if (r === "job_seeker") return "/jobseeker";
    return "/";
  };

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/companies" element={<CompaniesPage />} />
      <Route path="/jobs" element={<JobsPage />} />

      <Route
        path="/login"
        element={user ? <Navigate to={getRedirectForRole(user.role)} replace /> : <LoginPage />}
      />

      <Route
        path="/signup"
        element={user ? <Navigate to={getRedirectForRole(user.role)} replace /> : <SignupPage />}
      />

      <Route
        path="/dashboard/jobs"
        element={
          <ProtectedRoute allowedRoles={["job_poster", "admin"]}>
            <RecruiterApplicantsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/jobs/:jobId"
        element={
          <ProtectedRoute allowedRoles={["job_poster", "admin"]}>
            <RecruiterApplicantsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["job_poster", "admin"]}>
            <JobPostDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/jobseeker"
        element={
          <ProtectedRoute allowedRoles={["job_seeker"]}>
            <JobSeekerDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/job/:jobId"
        element={
          <ProtectedRoute allowedRoles={["job_seeker"]}>
            <JobDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/writer-dashboard"
        element={
          <ProtectedRoute allowedRoles={["writer"]}>
            <div className="p-10 text-xl font-semibold">
              Writer Dashboard (Coming Soon)
            </div>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
