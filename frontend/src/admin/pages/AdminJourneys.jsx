import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import Sidebar from "../layout/Sidebar";
import Topbar from "../layout/Topbar";
import { getAdminJourneys } from "../api/adminDashboardApi";

export default function AdminJourneys() {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    from_date: "",
    to_date: "",
    status: "",
  });

  useEffect(() => {
    setLoading(true);
    getAdminJourneys(filters)
      .then((res) => {
        setJourneys(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filters]);

  return (
    <AdminLayout>
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <Topbar />

          <main className="p-6">
            <h1 className="text-xl font-semibold text-white mb-4">
              Journey Records
            </h1>

            {/* 🔍 FILTER BAR */}
            <div className="flex flex-wrap gap-4 mb-4">
              <input
                type="date"
                className="bg-[#0f1424] text-white px-3 py-2 rounded border border-white/10 scheme-dark"
                value={filters.from_date}
                onChange={(e) =>
                  setFilters({ ...filters, from_date: e.target.value })
                }
              />

              <input
                type="date"
                className="bg-[#0f1424] text-white px-3 py-2 rounded border border-white/10 scheme-dark"
                value={filters.to_date}
                onChange={(e) =>
                  setFilters({ ...filters, to_date: e.target.value })
                }
              />

              <select
                className="bg-[#0f1424] text-white px-3 py-2 rounded border border-white/10"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="">All Status</option>
                <option value="COMPLETED">Completed</option>
                <option value="IN_PROGRESS">In Progress</option>
              </select>

              <button
                onClick={() =>
                  setFilters({ from_date: "", to_date: "", status: "" })
                }
                className="px-4 py-2 rounded bg-white/10 text-white hover:bg-white/20"
              >
                Reset
              </button>
            </div>

            {/* 📊 TABLE */}
            <div
              style={{ backgroundColor: "#111827" }}
              className="rounded-xl overflow-x-auto shadow-lg"
            >
              <table className="w-full text-sm text-left">
                <thead
                  style={{ backgroundColor: "#0f1424" }}
                  className="text-slate-300"
                >
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Bus</th>
                    <th className="px-4 py-3">Entry</th>
                    <th className="px-4 py-3">Exit</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Distance (km)</th>
                    <th className="px-4 py-3">Fare</th>
                    <th className="px-4 py-3">Time</th>
                  </tr>
                </thead>

                <tbody>
                  {loading && (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-4 py-6 text-center text-slate-400"
                      >
                        Loading journeys...
                      </td>
                    </tr>
                  )}

                  {!loading && journeys.length === 0 && (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-4 py-6 text-center text-slate-400"
                      >
                        No journeys found
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    journeys.map((j) => (
                      <tr
                        key={j.journey_id}
                        className="border-t border-white/5 hover:bg-white/5"
                      >
                        <td className="px-4 py-3 text-white">{j.user_name}</td>
                        <td className="px-4 py-3 text-slate-300">
                          {j.bus_number}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {j.entry_stop || "-"}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {j.exit_stop || "-"}
                        </td>

                        <td className="px-4 py-3">
                          {j.status === "COMPLETED" ? (
                            <span className="px-2 py-1 text-xs rounded bg-green-500/15 text-green-400">
                              Completed
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs rounded bg-yellow-500/15 text-yellow-400">
                              In Progress
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-slate-300">
                          {j.distance_km}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          ₹{j.fare_amount}
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {j.created_at}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </AdminLayout>
  );
}
