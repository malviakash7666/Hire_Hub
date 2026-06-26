import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/Public/HomePage";
import LoginPage from "./auth/LoginPage";
import SignupPage from "./auth/SignupPage";

import JobPostDashboardPage from "./pages/dashbord/JobPostDashboardPage";
import MyJobsPage from "./pages/dashbord/MyJobsPage";
import RecruiterApplicantsPage from "./pages/jobPoster/RecruiterApplicantsPage";
import JobSeekerDashboardPage from "./pages/dashbord/JobSeekerDashboardPage";

import CompaniesPage from "./pages/Public/CompaniesPage";
import JobsPage from "./pages/jobPoster/JobsPage";
import CategoriesPage from "./pages/CategoriesPage";
import PricingPage from "./pages/Public/PricingPage";
import AboutPage from "./pages/Public/AboutPage";
import CompanyProfilePage from "./pages/jobPoster/CompanyProfilePage";
import SettingsPage from "./pages/jobPoster/SettingsPage";

import ProtectedRoute from "./routes/Protected.routes";
import { useAuth } from "./hooks/useAuth";

import PublicLayout from "./layout/PublicLayout";
import DashboardLayout from "./layout/DashboardLayout";

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

  if (loading) return <div />;

  return (
    <Routes>
      {/* AUTH */}
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to={getRoleRedirect((user as any)?.role)} replace />
          ) : (
            <LoginPage />
          )
        }
      />

      <Route
        path="/signup"
        element={
          user ? (
            <Navigate to={getRoleRedirect((user as any)?.role)} replace />
          ) : (
            <SignupPage />
          )
        }
      />

      {/* PUBLIC */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />

        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <JobsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* DASHBOARD */}
      <Route element={<DashboardLayout />}>
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
              <MyJobsPage />
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