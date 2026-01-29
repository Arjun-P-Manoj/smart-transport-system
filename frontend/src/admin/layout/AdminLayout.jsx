export default function AdminLayout({ children }) {
  return (
    <div
      className="
        min-h-screen
        bg-linear-to-br from-[#0b1020] via-[#0e1530] to-[#0b1020]
        text-white
      "
    >
      {/* PAGE CONTAINER */}
      <div className="min-h-screen flex flex-col">
        {/* CONTENT AREA */}
        <div className="flex-1">
          {children}
        </div>

        {/* OPTIONAL FOOTER (can remove if not needed) */}
        <footer className="text-center text-xs text-slate-500 py-4">
          Smart Transport System · Admin Panel
        </footer>
      </div>
    </div>
  );
}