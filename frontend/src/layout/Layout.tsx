import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <main className="min-h-screen bg-gray-50">
      <Outlet />
    </main>
  );
};

export default Layout;