import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getAdminJourneyChart } from "../../api/adminDashboardApi";

export default function JourneyLineChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getAdminJourneyChart().then((res) => {
      setData(res.data);
    });
  }, []);

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            tickLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#c7d2fe" }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#8b5cf6"
            strokeWidth={3}
            dot={{ r: 5, fill: "#a78bfa" }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
