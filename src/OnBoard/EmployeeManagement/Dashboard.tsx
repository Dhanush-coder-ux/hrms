import { Header } from "./Dashboard/Header";
import { StatCards } from "./Dashboard/StatCards";
import { AttendanceChart } from "./Dashboard/Charts/AttendanceChart";
import { DepartmentChart } from "./Dashboard/Charts/DepartmentChart";
import { RecentActivity } from "./Dashboard/RecentActivity";
import { WorkforceSummary } from "./Dashboard/WorkforceSummary";

export const Dashboard = () => {
  return (
    <section className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

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
