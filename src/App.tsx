import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Navbar } from "./Root/Navbar";

function App() {
  return (
    <div className="flex flex-col h-screen">

      {/* Common Navbar */}
      <Navbar />

      {/* Pages */}
      <div className="flex-1">
        <RouterProvider router={router} />
      </div>

    </div>
  );
}

export default App;