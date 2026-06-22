import { Briefcase } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

interface MenuItem {
  label: string;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard/jobs",
  },
  {
    label: "My Jobs",
    path: "/dashboard/my-jobs",
  },
  {
    label: "Application",
    path: "/dashboard/applications",
},
{
  label: "Profile",
  path: "/dashboard/company",
},
  {
    label: "Settings",
    path: "/dashboard/settings",
  },
];

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200">
      <div className="p-6 border-b">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-extrabold text-gray-900 tracking-tight">
            HireHub
          </span>
        </Link>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-blue-500 text-white"
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