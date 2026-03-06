import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export const RootLayout = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">

      {/* Common Navbar */}
      <Navbar />

      {/* Page Content */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>

    </div>
  );
};