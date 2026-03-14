import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { day: "Mon", value: 120 },
  { day: "Tue", value: 130 },
  { day: "Wed", value: 125 },
  { day: "Thu", value: 140 },
  { day: "Fri", value: 138 }
];

export const AttendanceChart = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">

      <h3 className="font-semibold mb-4">Weekly Attendance</h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
};
