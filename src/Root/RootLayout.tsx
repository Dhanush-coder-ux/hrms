import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export const RootLayout = () => {
  const location = useLocation();
  const hideSidebarRoutes = ["/"];
  const isSelectionPage = hideSidebarRoutes.includes(location.pathname);

  return (
    // 1. Change to flex-col so Navbar stays at the top
    <div className="h-screen w-full flex flex-col overflow-hidden">

      <Navbar />

      {/* 2. This container holds the Sidebar and Main content side-by-side */}
      <div className="flex flex-1 overflow-hidden">

        {!isSelectionPage && <Sidebar />}

        <main className="flex-1 h-full overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};