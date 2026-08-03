import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export const RootLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-slate-50 relative">
      {/* Top Navbar */}
      <Navbar onToggleMobile={() => setIsMobileOpen(!isMobileOpen)} />

      {/* Main Container: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        <main className="flex-1 h-full overflow-y-auto w-full custom-scrollbar">
          <div key={location.pathname} className="animate-fade-in min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};