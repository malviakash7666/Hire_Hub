import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Briefcase, Menu, X } from "lucide-react";
import { getMe, logoutUser, type User, type UserRole } from "../service/auth.service";

interface NavLink {
  label: string;
  to: string;
}

const navLinks: NavLink[] = [
  { label: "Find Jobs", to: "/jobs" },
  { label: "Companies", to: "/companies" },
  { label: "Categories", to: "/categories" },
  { label: "About Us", to: "/about" },
  { label: "Pricing", to: "/pricing" },
];

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const isActive = (to: string): boolean => location.pathname === to;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getMe();
        setUser(res.user);
      } catch (error) {
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };

const getDashboardPath = (role?: UserRole) => {
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
  

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-[68px] gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-extrabold text-gray-900 tracking-tight">
            HireHub
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm font-medium transition-colors ${
                isActive(to)
                  ? "text-blue-600 font-semibold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {!checkingAuth && user ? (
            <>
             <Link
  to={getDashboardPath(user?.role)}
  className="px-5 py-2 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
>
  Dashboard
</Link>

              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:border-red-500 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            !checkingAuth && (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 pb-5 pt-3 space-y-1">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive(to)
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {label}
            </Link>
          ))}

          <div className="pt-3 flex flex-col gap-2">
            {!checkingAuth && user ? (
              <>
              <Link
  to={getDashboardPath(user?.role)}
  onClick={() => setMobileOpen(false)}
  className="w-full text-center px-5 py-2.5 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
>
  Dashboard
</Link>

                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:border-red-500 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              !checkingAuth && (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center px-5 py-2.5 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
