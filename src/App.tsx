import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ThemeProvider } from "./Themes/ThemeContext";
// import { Navbar } from "./Root/Navbar";

function App() {
  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen">
        {/* Pages */}
        <div className="flex-1">
          <RouterProvider router={router} />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;