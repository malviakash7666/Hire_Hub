import React, { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  User,
  UserPlus,
} from "lucide-react";
import { registerUser } from "../api/auth.api";
import { useAuth } from "../hooks/useAuth";

type RegisterFormData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "job_poster" | "job_seeker";
};

/* ── Role-based redirect map ── */
const getRoleRedirect = (role: string): string => {
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

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "job_seeker",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const { setUser } = useAuth();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setErrorMessage("Full name is required");
      return false;
    }
    if (formData.fullName.trim().length < 2) {
      setErrorMessage("Full name must be at least 2 characters");
      return false;
    }
    if (!formData.email.trim()) {
      setErrorMessage("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }
    if (!formData.password.trim()) {
      setErrorMessage("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return false;
    }
    if (!formData.confirmPassword.trim()) {
      setErrorMessage("Confirm password is required");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return false;
    }
    if (!formData.role) {
      setErrorMessage("Please select a role");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      };

      const response = await registerUser(payload);

      const {  user } = response?.data ?? {};
     if (user) {
  setUser(user as any);
}

      setSuccessMessage(
        response?.data?.message || "Account created successfully! Redirecting..."
      );

      const redirect = getRoleRedirect(formData.role);
      setTimeout(() => navigate(redirect, { replace: true }), 1200);
    } catch (error: any) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Registration failed. Please try again.";
      setErrorMessage(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans" style={{ fontFamily: "'DM Sans', 'Nunito', sans-serif", background: "#f0f4ff" }}>

      {/* ── Left Panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden px-14 py-12"
        style={{
          background: "linear-gradient(145deg, #eef2ff 0%, #dbeafe 40%, #ede9fe 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div style={{ position: "absolute", top: "-80px", left: "-80px", width: "320px", height: "320px", borderRadius: "50%", background: "rgba(99,102,241,0.12)", filter: "blur(60px)" }} />
          <div style={{ position: "absolute", bottom: "60px", right: "-60px", width: "280px", height: "280px", borderRadius: "50%", background: "rgba(59,130,246,0.14)", filter: "blur(60px)" }} />
          <div style={{ position: "absolute", top: "45%", left: "30%", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(167,139,250,0.1)", filter: "blur(50px)" }} />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl shadow-md" style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}>
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">JobPortal</span>
        </div>

        {/* Center hero */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* SVG Illustration */}
          <div className="mb-8 relative">
            <div style={{ width: "280px", height: "280px", borderRadius: "50%", background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(59,130,246,0.15))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
              <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Shadow */}
                <ellipse cx="100" cy="178" rx="52" ry="16" fill="rgba(99,102,241,0.12)" />
                {/* Legs */}
                <rect x="84" y="138" width="14" height="42" rx="7" fill="#6366f1" />
                <rect x="102" y="138" width="14" height="42" rx="7" fill="#818cf8" />
                {/* Shoes */}
                <ellipse cx="91" cy="179" rx="13" ry="6" fill="#4338ca" />
                <ellipse cx="109" cy="179" rx="13" ry="6" fill="#4338ca" />
                {/* Torso */}
                <rect x="76" y="90" width="48" height="54" rx="16" fill="#6366f1" />
                {/* Collar */}
                <path d="M96 90 L100 103 L104 90" fill="#4f46e5" />
                {/* Tie */}
                <polygon points="100,95 97,107 100,118 103,107" fill="#fbbf24" />
                {/* Left arm — holding document */}
                <rect x="56" y="94" width="22" height="11" rx="5.5" fill="#818cf8" transform="rotate(-20 56 100)" />
                <circle cx="50" cy="107" r="8" fill="#fcd9b0" />
                {/* Document in left hand */}
                <rect x="26" y="98" width="28" height="36" rx="4" fill="white" stroke="#6366f1" strokeWidth="1.5" />
                <rect x="30" y="104" width="12" height="2.5" rx="1.25" fill="#6366f1" opacity="0.5" />
                <rect x="30" y="109" width="18" height="2" rx="1" fill="#c7d2fe" />
                <rect x="30" y="114" width="14" height="2" rx="1" fill="#c7d2fe" />
                <rect x="30" y="119" width="16" height="2" rx="1" fill="#c7d2fe" />
                <circle cx="38" cy="128" r="5" fill="#6366f1" />
                <path d="M35.5 128 L37.5 130 L41 126" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                {/* Right arm */}
                <rect x="122" y="94" width="22" height="11" rx="5.5" fill="#818cf8" transform="rotate(20 132 100)" />
                <circle cx="150" cy="107" r="8" fill="#fcd9b0" />
                {/* Head */}
                <circle cx="100" cy="70" r="28" fill="#fcd9b0" />
                {/* Hair */}
                <path d="M73 64 Q100 42 127 64 Q124 48 100 43 Q76 48 73 64Z" fill="#1e1b4b" />
                {/* Ears */}
                <ellipse cx="72.5" cy="72" rx="4" ry="6" fill="#fcd9b0" />
                <ellipse cx="127.5" cy="72" rx="4" ry="6" fill="#fcd9b0" />
                {/* Eyes */}
                <circle cx="90" cy="70" r="4.5" fill="white" />
                <circle cx="110" cy="70" r="4.5" fill="white" />
                <circle cx="91" cy="71" r="2" fill="#1e1b4b" />
                <circle cx="111" cy="71" r="2" fill="#1e1b4b" />
                <circle cx="92" cy="70" r="0.8" fill="white" />
                <circle cx="112" cy="70" r="0.8" fill="white" />
                {/* Smile */}
                <path d="M91 82 Q100 90 109 82" stroke="#e07b54" strokeWidth="2" fill="none" strokeLinecap="round" />
                {/* Star badge */}
                <circle cx="160" cy="55" r="14" fill="#fef9c3" stroke="#fbbf24" strokeWidth="2" />
                <text x="160" y="60" textAnchor="middle" fontSize="14" fill="#f59e0b">★</text>
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
            Start your Journey!
          </h2>
          <p className="mt-3 text-base text-slate-500 max-w-xs leading-relaxed">
            Join as a job seeker to discover opportunities or as a recruiter to find the best talent.
          </p>

          {/* Role info cards */}
          <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
            {[
              { icon: "🔍", text: "Job Seeker — Find your next role", color: "rgba(99,102,241,0.08)" },
              { icon: "🏢", text: "Job Poster — Hire with confidence", color: "rgba(16,185,129,0.08)" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left"
                style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.8)" }}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium text-slate-600">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom badge */}
        <div className="relative z-10 flex items-center gap-2 text-sm text-slate-500">
          <ShieldCheck className="h-4 w-4 text-indigo-400" />
          <span>Create your account and get started</span>
        </div>
      </div>

      {/* ── Right Panel / Form ── */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl shadow-md" style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}>
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">JobPortal</span>
          </div>

          <div className="mb-7">
            <p className="text-sm font-semibold text-indigo-500 uppercase tracking-widest mb-2">Create Account</p>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Register</h2>
            <p className="mt-2 text-sm text-slate-400">Join as a job seeker or job poster and begin your journey.</p>
          </div>

          {errorMessage && (
            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-slate-600">
                Full Name
              </label>
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-3 transition"
                style={{ border: "1.5px solid #e2e8f0", background: "#f8fafc" }}
              >
                <User className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-600">
                Email Address
              </label>
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-3 transition"
                style={{ border: "1.5px solid #e2e8f0", background: "#f8fafc" }}
              >
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-slate-600">
                I want to
              </label>
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-3 transition"
                style={{ border: "1.5px solid #e2e8f0", background: "#f8fafc" }}
              >
                <UserPlus className="h-4 w-4 text-slate-400 shrink-0" />
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm text-slate-800 outline-none"
                  style={{ appearance: "none" }}
                >
                  <option value="job_seeker">Find a job (Job Seeker)</option>
                  <option value="job_poster">Hire talent (Job Poster)</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-600">
                Password
              </label>
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-3 transition"
                style={{ border: "1.5px solid #e2e8f0", background: "#f8fafc" }}
              >
                <Lock className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-slate-400 transition hover:text-slate-600 shrink-0"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-slate-600">
                Confirm Password
              </label>
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-3 transition"
                style={{ border: "1.5px solid #e2e8f0", background: "#f8fafc" }}
              >
                <Lock className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="text-slate-400 transition hover:text-slate-600 shrink-0"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)", boxShadow: "0 4px 20px rgba(99,102,241,0.35)" }}
            >
              {loading ? "Creating account..." : "Create Account"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-500 transition hover:text-indigo-700"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;