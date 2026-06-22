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
} from "lucide-react";
import { loginUser } from "../api/auth.api";
import { useAuth } from "../hooks/useAuth";

type LoginFormData = {
  email: string;
  password: string;
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

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const { setUser } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const validateForm = () => {
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
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      const { user } = response?.data ?? {};
   
      if (user) {
       
        setUser(user as any);
      }

      setSuccessMessage(response?.data?.message || "Login successful");

      const redirect = getRoleRedirect(user?.role ?? "");
      setTimeout(() => navigate(redirect, { replace: true }), 800);
    } catch (error: any) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Login failed. Please check your credentials.";
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
                {/* Person body */}
                <ellipse cx="100" cy="175" rx="50" ry="18" fill="rgba(99,102,241,0.15)" />
                {/* Legs */}
                <rect x="84" y="138" width="14" height="38" rx="7" fill="#6366f1" />
                <rect x="102" y="138" width="14" height="38" rx="7" fill="#818cf8" />
                {/* Shoes */}
                <ellipse cx="91" cy="176" rx="12" ry="6" fill="#4f46e5" />
                <ellipse cx="109" cy="176" rx="12" ry="6" fill="#4f46e5" />
                {/* Torso */}
                <rect x="76" y="92" width="48" height="52" rx="16" fill="#6366f1" />
                {/* Collar detail */}
                <path d="M96 92 L100 104 L104 92" fill="#4f46e5" />
                {/* Tie */}
                <polygon points="100,96 97,108 100,120 103,108" fill="#fbbf24" />
                {/* Arms */}
                <rect x="58" y="95" width="20" height="12" rx="6" fill="#818cf8" transform="rotate(-15 58 101)" />
                <rect x="122" y="95" width="20" height="12" rx="6" fill="#818cf8" transform="rotate(15 132 101)" />
                {/* Hands */}
                <circle cx="53" cy="108" r="8" fill="#fcd9b0" />
                <circle cx="147" cy="108" r="8" fill="#fcd9b0" />
                {/* Head */}
                <circle cx="100" cy="72" r="28" fill="#fcd9b0" />
                {/* Hair */}
                <path d="M73 65 Q100 44 127 65 Q124 50 100 44 Q76 50 73 65Z" fill="#1e1b4b" />
                {/* Eyes */}
                <circle cx="90" cy="70" r="4" fill="white" />
                <circle cx="110" cy="70" r="4" fill="white" />
                <circle cx="91" cy="71" r="2" fill="#1e1b4b" />
                <circle cx="111" cy="71" r="2" fill="#1e1b4b" />
                {/* Smile */}
                <path d="M90 82 Q100 90 110 82" stroke="#e07b54" strokeWidth="2" fill="none" strokeLinecap="round" />
                {/* Laptop */}
                <rect x="62" y="110" width="76" height="48" rx="6" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
                <rect x="66" y="114" width="68" height="38" rx="4" fill="white" />
                {/* Screen content */}
                <rect x="70" y="118" width="30" height="4" rx="2" fill="#6366f1" opacity="0.6" />
                <rect x="70" y="125" width="20" height="3" rx="1.5" fill="#c7d2fe" />
                <rect x="70" y="131" width="25" height="3" rx="1.5" fill="#c7d2fe" />
                <rect x="108" y="118" width="22" height="22" rx="4" fill="#dbeafe" />
                <path d="M114 130 L119 125 L124 130" stroke="#3b82f6" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                {/* Briefcase badge */}
                <circle cx="152" cy="90" r="16" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
                <rect x="145" y="87" width="14" height="10" rx="2" fill="#3b82f6" />
                <rect x="148" y="84" width="8" height="4" rx="1" fill="#93c5fd" />
                <rect x="151" y="90" width="2" height="4" rx="1" fill="white" />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
            Welcome Back!
          </h2>
          <p className="mt-3 text-base text-slate-500 max-w-xs leading-relaxed">
            Log in to explore thousands of job opportunities and connect with top employers.
          </p>

          {/* Feature pills */}
          <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
            {[
              { icon: "🎯", text: "Track all your applications" },
              { icon: "🏢", text: "Access recruiter workflows" },
              { icon: "⚡", text: "Faster and secure access" },
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
          <span>Secure candidate and recruiter access</span>
        </div>
      </div>

      {/* ── Right Panel / Form ── */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl shadow-md" style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}>
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">JobPortal</span>
          </div>

          <div className="mb-8">
            <p className="text-sm font-semibold text-indigo-500 uppercase tracking-widest mb-2">Welcome Back</p>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Sign in to your account</h2>
            <p className="mt-2 text-sm text-slate-400">Enter your credentials to continue your hiring journey.</p>
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

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-600">
                Email Address
              </label>
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-3 transition"
                style={{ border: "1.5px solid #e2e8f0", background: "#f8fafc" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
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

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-600">
                Password
              </label>
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-3 transition"
                style={{ border: "1.5px solid #e2e8f0", background: "#f8fafc" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
              >
                <Lock className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  autoComplete="current-password"
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

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500"
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-indigo-500 transition hover:text-indigo-700"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)", boxShadow: "0 4px 20px rgba(99,102,241,0.35)" }}
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-indigo-500 transition hover:text-indigo-700"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;