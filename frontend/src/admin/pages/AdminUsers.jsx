import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import Sidebar from "../layout/Sidebar";
import Topbar from "../layout/Topbar";
import { getAdminUsers } from "../api/adminDashboardApi";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    face: "",
    wallet: "",
    due: "", // ✅ NEW
  });

  useEffect(() => {
    setLoading(true);
    getAdminUsers(filters)
      .then((res) => {
        setUsers(res.data);
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
              User Management
            </h1>

            {/* 🔍 FILTER BAR */}
            <div className="flex flex-wrap gap-4 mb-4">
              <input
                type="text"
                placeholder="Search name / mobile"
                className="bg-[#0f1424] text-white px-3 py-2 rounded border border-white/10"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />

              <select
                className="bg-[#0f1424] text-white px-3 py-2 rounded border border-white/10"
                value={filters.face}
                onChange={(e) =>
                  setFilters({ ...filters, face: e.target.value })
                }
              >
                <option value="">Face Status</option>
                <option value="yes">Face Registered</option>
                <option value="no">Not Registered</option>
              </select>

              <select
                className="bg-[#0f1424] text-white px-3 py-2 rounded border border-white/10"
                value={filters.wallet}
                onChange={(e) =>
                  setFilters({ ...filters, wallet: e.target.value })
                }
              >
                <option value="">Wallet</option>
                <option value="zero">Zero Balance</option>
                <option value="nonzero">Non-zero Balance</option>
              </select>

              {/* 🚨 DUE FILTER */}
              <select
                className="bg-[#0f1424] text-white px-3 py-2 rounded border border-white/10"
                value={filters.due}
                onChange={(e) =>
                  setFilters({ ...filters, due: e.target.value })
                }
              >
                <option value="">All Users</option>
                <option value="yes">Due Pending</option>
                <option value="no">No Due</option>
              </select>

              <button
                onClick={() =>
                  setFilters({
                    search: "",
                    face: "",
                    wallet: "",
                    due: "",
                  })
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
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Mobile</th>
                    <th className="px-4 py-3">Wallet</th>
                    <th className="px-4 py-3">Due Amount</th>
                    <th className="px-4 py-3">Due Status</th>
                    <th className="px-4 py-3">Face</th>
                  </tr>
                </thead>

                <tbody>
                  {loading && (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-6 text-center text-slate-400"
                      >
                        Loading users...
                      </td>
                    </tr>
                  )}

                  {!loading && users.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-6 text-center text-slate-400"
                      >
                        No users found
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    users.map((u) => (
                      <tr
                        key={u.user_id}
                        className="border-t border-white/5 hover:bg-white/5"
                      >
                        <td className="px-4 py-3 text-white">{u.name}</td>
                        <td className="px-4 py-3 text-slate-300">{u.mobile}</td>
                        <td className="px-4 py-3 text-slate-300">
                          ₹{u.wallet_balance}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          ₹{u.due_amount}
                        </td>
                        <td className="px-4 py-3">
                          {u.due_status === "PENDING" ? (
                            <span className="px-2 py-1 text-xs rounded bg-red-500/15 text-red-400">
                              Due Pending
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs rounded bg-green-500/15 text-green-400">
                              Clear
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {u.face_registered ? (
                            <span className="text-green-400">Yes</span>
                          ) : (
                            <span className="text-red-400">No</span>
                          )}
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
