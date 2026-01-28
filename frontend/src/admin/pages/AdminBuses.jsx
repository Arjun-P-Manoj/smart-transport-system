import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import Sidebar from "../layout/Sidebar";
import Topbar from "../layout/Topbar";
import {
  getAdminBuses,
  getBusRouteStops,
} from "../api/adminDashboardApi";

export default function AdminBuses() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBus, setSelectedBus] = useState(null);
  const [routeStops, setRouteStops] = useState([]);
  const [loadingStops, setLoadingStops] = useState(false);

  const [filters, setFilters] = useState({
    status: "",
    direction: "",
    search: "",
  });

  useEffect(() => {
    setLoading(true);
    getAdminBuses(filters)
      .then((res) => {
        setBuses(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filters]);

  const handleViewStops = (busId) => {
    setSelectedBus(busId);
    setLoadingStops(true);

    getBusRouteStops(busId)
      .then((res) => {
        setRouteStops(res.data);
        setLoadingStops(false);
      })
      .catch(() => setLoadingStops(false));
  };

  return (
    <AdminLayout>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Topbar />

          <main className="p-6">
            <h1 className="text-xl font-semibold text-white mb-4">
              Bus Management
            </h1>

            {/* 🔍 FILTER BAR */}
            <div className="flex flex-wrap gap-4 mb-4">
              <select
                className="bg-[#0f1424] text-white px-3 py-2 rounded border border-white/10"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>

              <select
                className="bg-[#0f1424] text-white px-3 py-2 rounded border border-white/10"
                value={filters.direction}
                onChange={(e) =>
                  setFilters({ ...filters, direction: e.target.value })
                }
              >
                <option value="">All Directions</option>
                <option value="UP">UP</option>
                <option value="DOWN">DOWN</option>
              </select>

              <input
                type="text"
                placeholder="Search bus / plate"
                className="bg-[#0f1424] text-white px-3 py-2 rounded border border-white/10"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />

              <button
                onClick={() =>
                  setFilters({ status: "", direction: "", search: "" })
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
                    <th className="px-4 py-3">Bus No</th>
                    <th className="px-4 py-3">Number Plate</th>
                    <th className="px-4 py-3">Route</th>
                    <th className="px-4 py-3">Current Stop</th>
                    <th className="px-4 py-3">Direction</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading && (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 py-6 text-center text-slate-400"
                      >
                        Loading buses...
                      </td>
                    </tr>
                  )}

                  {!loading && buses.length === 0 && (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 py-6 text-center text-slate-400"
                      >
                        No buses found
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    buses.map((bus) => (
                      <tr
                        key={bus.bus_id}
                        className="border-t border-white/5 hover:bg-white/5"
                      >
                        <td className="px-4 py-3 text-white">
                          {bus.bus_number}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {bus.number_plate}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {bus.route_name || "-"}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {bus.current_stop || "-"}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {bus.direction}
                        </td>
                        <td className="px-4 py-3">
                          {bus.status === "ACTIVE" ? (
                            <span className="px-2 py-1 text-xs rounded bg-green-500/15 text-green-400">
                              Active
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs rounded bg-red-500/15 text-red-400">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleViewStops(bus.bus_id)}
                            className="px-3 py-1 text-xs rounded bg-violet-500/15 text-violet-400 hover:bg-violet-500/25"
                          >
                            View Stops
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>

      {/* 🚏 ROUTE STOPS MODAL */}
      {selectedBus && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#0f1424] rounded-xl w-105 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Route Stops
            </h2>

            {loadingStops ? (
              <p className="text-slate-400 text-sm">Loading stops...</p>
            ) : (
              <ul className="space-y-2">
                {routeStops.map((stop) => (
                  <li
                    key={stop.stop_id}
                    className="flex justify-between text-sm text-slate-300"
                  >
                    <span>
                      {stop.stop_order}. {stop.stop_name}
                    </span>
                    <span>{stop.distance_km} km</span>
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => setSelectedBus(null)}
              className="mt-5 px-4 py-2 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
