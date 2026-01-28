import { Search, Bell, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminGlobalSearch } from "../api/adminDashboardApi";

export default function Topbar() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    navigate("/admin/login");
  };

  // 🔍 Global search effect
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const delay = setTimeout(() => {
      adminGlobalSearch(query).then((res) => {
        setResults(res.data);
      });
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  const handleSelect = (item) => {
    setQuery("");
    setResults([]);

    if (item.type === "user") navigate("/admin/users");
    if (item.type === "bus") navigate("/admin/buses");
    if (item.type === "journey") navigate("/admin/journeys");
  };

  return (
    <header
      style={{
        backgroundColor: "#0f1424",
        borderBottom: "1px solid #1f2937",
      }}
      className="h-16 flex items-center justify-between px-6"
    >
      {/* LEFT: Title + Search */}
      <div className="flex items-center gap-6 relative">
        <h2 className="text-sm font-semibold text-slate-200 tracking-wide">
          Admin Dashboard
        </h2>

        {/* 🔍 Search Box */}
        <div
          style={{ backgroundColor: "#0b0f19" }}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#1f2937] relative"
        >
          <Search size={14} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users, buses, journeys..."
            className="bg-transparent outline-none text-sm text-slate-200 placeholder-slate-500 w-56"
          />

          {/* 🔽 Search Results Dropdown */}
          {results.length > 0 && (
            <div className="absolute top-10 left-0 w-full bg-[#0f1424] border border-[#1f2937] rounded-md shadow-xl z-50">
              {results.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelect(item)}
                  className="px-3 py-2 hover:bg-white/10 cursor-pointer"
                >
                  <p className="text-sm text-slate-200">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-400">
                    {item.type.toUpperCase()} • {item.subtitle}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          className="relative text-slate-400 hover:text-slate-200 transition"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-indigo-500" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-[#1f2937]" />

        {/* Admin Info */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center
                       text-sm font-semibold text-white"
            style={{ backgroundColor: "#4f46e5" }}
          >
            A
          </div>

          <div className="hidden sm:flex flex-col text-xs">
            <span className="text-slate-200 font-medium">
              Admin
            </span>
            <span className="text-slate-400">
              System Administrator
            </span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 transition"
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
