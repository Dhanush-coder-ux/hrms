import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

const data = [
  { name: "HR", value: 20 },
  { name: "IT", value: 50 },
  { name: "Finance", value: 30 },
  { name: "Sales", value: 40 }
];

export const DepartmentChart = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">

      <h3 className="font-semibold mb-4">Departments</h3>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={90}>
            {data.map((_, index) => (
              <Cell key={index} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

    </div>
  );
};
