import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getAdminRevenueChart } from "../../api/adminDashboardApi";

export default function RevenueBarChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getAdminRevenueChart().then((res) => {
      setData(res.data);
    });
  }, []);

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="date" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#c7d2fe" }}
          />
          <Bar
            dataKey="amount"
            fill="#8b5cf6"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
