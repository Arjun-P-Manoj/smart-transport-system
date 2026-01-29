export default function Toast({ message, type = "success", onClose }) {
  if (!message) return null;

  return (
    <div className="fixed top-6 right-6 z-50">
      <div
        className={`
          flex items-center gap-3
          rounded-lg px-5 py-4 shadow-lg
          text-white font-medium
          ${
            type === "success"
              ? "bg-green-600"
              : type === "error"
              ? "bg-red-600"
              : "bg-slate-700"
          }
        `}
      >
        <span>
          {type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"}
        </span>
        <span>{message}</span>

        <button
          onClick={onClose}
          className="ml-4 text-white/70 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}