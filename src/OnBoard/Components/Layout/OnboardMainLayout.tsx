
import {OnboardSidebar} from "./Sidebar";

import { Outlet } from "react-router-dom";

const OnbordMainLayout = () => {
  return (
    <div className="h-full w-full flex overflow-hidden">
      

      <div className="flex flex-1 overflow-hidden">
        <OnboardSidebar />
    
      
    
      <main className="flex-1 h-full overflow-y-auto custom-scrollbar">
      
        <div className="p-4 lg:p-6 min-h-full">
            <Outlet/>
          </div>
      </main>
        </div>
    </div>
  );
};

export default OnbordMainLayout;