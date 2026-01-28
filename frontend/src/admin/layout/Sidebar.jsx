// Sidebar.jsx
import {
  LayoutDashboard,
  Users,
  Bus,
  Route,
  Wallet,
  Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menu = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Users", icon: Users, path: "/admin/users" },
  { label: "Buses", icon: Bus, path: "/admin/buses" },
  { label: "Journeys", icon: Route, path: "/admin/journeys" },
  { label: "Transactions", icon: Wallet, path: "/admin/transactions" },
  {
    label: "Manage Transport",
    icon: Settings,
    path: "/admin/manage-transport",
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-[#0f1424] flex flex-col">
      <h1 className="text-lg font-semibold text-white px-4 mt-6 mb-8">
        Smart Transport
      </h1>

      <nav className="space-y-1">
        {menu.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all
              ${
                isActive
                  ? "bg-[#7551ff] text-white"
                  : "text-[#94a3b8] hover:bg-[#111c44]"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
