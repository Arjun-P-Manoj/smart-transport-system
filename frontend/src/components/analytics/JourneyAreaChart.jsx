import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function JourneyAreaChart({ data }) {
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart
        data={data}
        margin={{ top: 30, right: 24, left: 20, bottom: 0 }}
      >
        <defs>
          <linearGradient id="fareGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 6"
          stroke="#27272a"
          vertical={false}
        />

        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          stroke="#a1a1aa"
          tick={{ fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          width={48}
          stroke="#a1a1aa"
          tickFormatter={(v) => `₹${v}`}
          tick={{ fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          domain={[0, "dataMax + 20"]}
        />

        <Tooltip
          cursor={{ stroke: "#6366f1", strokeDasharray: "3 3" }}
          contentStyle={{
            backgroundColor: "#09090b",
            border: "1px solid #27272a",
            borderRadius: "8px",
            fontSize: "13px",
          }}
          labelStyle={{ color: "#a1a1aa" }}
          formatter={(value) => [`₹ ${value}`, "Fare"]}
        />

        <Area
          type="monotone"
          dataKey="fare"
          stroke="#6366f1"
          strokeWidth={2.5}
          fill="url(#fareGradient)"
          dot={{
            r: 4,
            fill: "#09090b",
            stroke: "#6366f1",
            strokeWidth: 2,
          }}
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}