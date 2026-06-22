import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Public/HomePage";
import LoginPage from "./auth/LoginPage";
import SignupPage from "./auth/SignupPage";
import JobPostDashboardPage from "./pages/dashbord/JobPostDashboardPage";
import RecruiterApplicantsPage from "./pages/jobPoster/RecruiterApplicantsPage";
import JobSeekerDashboardPage from "./pages/dashbord/JobSeekerDashboardPage";
import ProtectedRoute from "./routes/Protected.routes";
import { useAuth } from "./hooks/useAuth";
import CompaniesPage from "./pages/Public/CompaniesPage";
import JobsPage from "./pages/jobPoster/JobsPage";
import CategoriesPage from "./pages/CategoriesPage";
import PricingPage from "./pages/Public/PricingPage";
import AboutPage from "./pages/Public/AboutPage";
import CompanyProfilePage from "./pages/jobPoster/CompanyProfilePage";
import SettingsPage from "./pages/jobPoster/SettingsPage";
import Layout from "./layout/Layout";

const getRoleRedirect = (role: string | undefined) => {
  if (!role) return "/";
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

const App = () => {
  const { user, loading } = useAuth();

return (
  <Routes>
    <Route
      path="/"
      element={loading ? <div /> : <HomePage />}
    />

    <Route
      path="/login"
      element={
        loading ? (
          <div />
        ) : user ? (
          <Navigate to={getRoleRedirect((user as any)?.role)} replace />
        ) : (
          <LoginPage />
        )
      }
    />

    <Route
      path="/signup"
      element={
        loading ? (
          <div />
        ) : user ? (
          <Navigate to={getRoleRedirect((user as any)?.role)} replace />
        ) : (
          <SignupPage />
        )
      }
    />
    <Route element={<Layout />}>

    <Route path="/companies" element={<CompaniesPage />} />
    <Route path="/jobs" element={<JobsPage />} />
    <Route path="/categories" element={<CategoriesPage />} />
    <Route path="/pricing" element={<PricingPage />} />
    <Route path="/about" element={<AboutPage />} />

    <Route
      path="/dashboard/jobs"
      element={
        <ProtectedRoute allowedRoles={["job_poster", "admin"]}>
          <JobPostDashboardPage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/dashboard/my-jobs"
      element={
        <ProtectedRoute allowedRoles={["job_poster", "admin"]}>
          <JobsPage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/dashboard/applications"
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
      path="/dashboard/company"
      element={
        <ProtectedRoute allowedRoles={["job_poster", "admin"]}>
          <CompanyProfilePage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/dashboard/settings"
      element={
        <ProtectedRoute allowedRoles={["job_poster", "admin"]}>
          <SettingsPage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute allowedRoles={["job_seeker"]}>
          <JobSeekerDashboardPage />
        </ProtectedRoute>
      }
    />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
};

export default App;
