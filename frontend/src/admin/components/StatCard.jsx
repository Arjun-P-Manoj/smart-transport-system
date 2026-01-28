// StatCard.jsx
export default function StatCard({
  title,
  value,
  subtitle,
  highlight = "normal",
}) {
  const cardBg =
    highlight === "danger"
      ? "bg-red-500/10 border border-red-500/30"
      : "bg-[#0f1b3d]";

  const valueColor =
    highlight === "danger" ? "text-red-400" : "text-white";

  // 🔥 Subtitle color logic
  const subtitleColor =
    highlight === "danger" ? "text-red-400" : "text-green-400";

  return (
    <div className={`rounded-xl p-5 ${cardBg}`}>
      <p className="text-sm text-[#94a3b8]">{title}</p>

      <h2 className={`text-2xl font-semibold mt-1 ${valueColor}`}>
        {value}
      </h2>

      {subtitle && (
        <p className={`text-xs mt-1 ${subtitleColor}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
