import { Header } from "../Dashboard/Header";
import { StatCards } from "../Dashboard/StatCards";
import { AttendanceChart } from "../Dashboard/Charts/AttendanceChart";
import { DepartmentChart } from "../Dashboard/Charts/DepartmentChart";
import { RecentActivity } from "../Dashboard/RecentActivity";
import { WorkforceSummary } from "../Dashboard/WorkforceSummary";
import { DashboardLeaveRequests } from "../Dashboard/DashboardLeaveRequests";

import { empMangeTheme } from "../../../Themes/EmpMangeTheme/empMangeConfig";

export const Dashboard = () => {
  return (
    <section className={empMangeTheme.layout.mainContainer}>
      <div className="max-w-7xl mx-auto space-y-10">

        <Header />

        <StatCards />

        <div className="grid lg:grid-cols-2 gap-6">
          <AttendanceChart />
          <DepartmentChart />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DashboardLeaveRequests />
          </div>
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>
        </div>

        <WorkforceSummary />

      </div>
    </section>
  );
};

