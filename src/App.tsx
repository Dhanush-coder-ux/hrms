import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ThemeProvider } from "./Themes/ThemeContext";
import { AuthProvider } from "./auth/AuthContext";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="flex flex-col h-screen">
          {/* Pages */}
          <div className="flex-1">
            <RouterProvider router={router} />
          </div>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;