// src/admin/components/Card.jsx
export default function Card({ children, className = "" }) {
  return (
    <div
      style={{ backgroundColor: "#111827" }}
      className={`
        rounded-xl
        p-6
        shadow-[0_20px_60px_rgba(0,0,0,0.6)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}
