import { Header } from "../Dashboard/Header";
import { StatCards } from "../Dashboard/StatCards";
import { AttendanceChart } from "../Dashboard/Charts/AttendanceChart";
import { DepartmentChart } from "../Dashboard/Charts/DepartmentChart";
import { RecentActivity } from "../Dashboard/RecentActivity";
import { WorkforceSummary } from "../Dashboard/WorkforceSummary";

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

        <RecentActivity />

        <WorkforceSummary />

      </div>
    </section>
  );
};
