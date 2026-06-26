import { Briefcase } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Sidebar = () => {
  const { user } = useAuth();
  const role = (user as any)?.role;

  const menuItems =
    role === "job_seeker"
      ? [
          { label: "Dashboard", path: "/dashboard" },
          { label: "My Jobs", path: "/jobs" },
        ]
      : [
          { label: "Dashboard", path: "/dashboard/jobs" },
          { label: "My Jobs", path: "/dashboard/my-jobs" },
          { label: "Applications", path: "/dashboard/applications" },
          { label: "Profile", path: "/dashboard/company" },
          { label: "Settings", path: "/dashboard/settings" },
        ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 sticky top-0">
      <div className="p-6 border-b">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow">
            <Briefcase className="w-4 h-4 text-white" />
          </div>

          <span className="text-lg font-extrabold">HireHub</span>
        </Link>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;