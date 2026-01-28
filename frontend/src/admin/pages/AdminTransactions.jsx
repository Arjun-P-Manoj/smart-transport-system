import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import Sidebar from "../layout/Sidebar";
import Topbar from "../layout/Topbar";
import { getAdminTransactions } from "../api/adminDashboardApi";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    transaction: "",
    from_date: "",
    to_date: "",
  });
  useEffect(() => {
    setLoading(true);

    const apiFilters = {
      search: filters.search,
      from_date: filters.from_date,
      to_date: filters.to_date,
    };

    if (filters.transaction === "TOPUP") {
      apiFilters.type = "CREDIT";
      apiFilters.reason = "RECHARGE";
    }

    if (filters.transaction === "FARE") {
      apiFilters.type = "DEBIT";
      apiFilters.reason = "JOURNEY_FARE";
    }

    if (filters.transaction === "DUE") {
      apiFilters.type = "DEBIT";
      apiFilters.reason = "DUE_SETTLEMENT";
    }

    getAdminTransactions(apiFilters)
      .then((res) => {
        setTransactions(res.data);
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
              Transactions
            </h1>

            {/* FILTER BAR */}
            <div className="flex flex-wrap gap-4 mb-4">
              <input
                type="text"
                placeholder="Search user"
                className="bg-[#0f1424] text-white px-3 py-2 rounded border border-white/10"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />

              <select
                className="bg-[#0f1424] text-white px-3 py-2 rounded border border-white/10"
                value={filters.transaction}
                onChange={(e) =>
                  setFilters({ ...filters, transaction: e.target.value })
                }
              >
                <option value="">All Transactions</option>
                <option value="TOPUP">Wallet Top-up</option>
                <option value="FARE">Journey Fare</option>
                <option value="DUE">Due Amount Deducted</option>
              </select>

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

              <button
                onClick={() =>
                  setFilters({
                    search: "",
                    transaction: "",
                    from_date: "",
                    to_date: "",
                  })
                }
                className="px-4 py-2 rounded bg-white/10 text-white hover:bg-white/20"
              >
                Reset
              </button>
            </div>

            {/* TABLE */}
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
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Transaction Type</th>
                    <th className="px-4 py-3">Time</th>
                  </tr>
                </thead>

                <tbody>
                  {loading && (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-4 py-6 text-center text-slate-400"
                      >
                        Loading transactions...
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    transactions.map((t) => (
                      <tr
                        key={t.transaction_id}
                        className="border-t border-white/5 hover:bg-white/5"
                      >
                        <td className="px-4 py-3 text-white">{t.user_name}</td>

                        <td className="px-4 py-3 text-slate-300">
                          ₹{t.amount}
                        </td>

                        {/* ✅ CORRECTED LOGIC BASED ON YOUR DB */}
                        <td className="px-4 py-3">
                          {t.type === "CREDIT" && t.reason === "RECHARGE" && (
                            <span className="px-2 py-1 text-xs rounded bg-green-500/15 text-green-400">
                              Wallet Top-up
                            </span>
                          )}

                          {t.type === "DEBIT" &&
                            t.reason === "JOURNEY_FARE" && (
                              <span className="px-2 py-1 text-xs rounded bg-red-500/15 text-red-400">
                                Journey Fare
                              </span>
                            )}

                          {t.type === "DEBIT" &&
                            t.reason === "DUE_SETTLEMENT" && (
                              <span className="px-2 py-1 text-xs rounded bg-orange-500/15 text-orange-400">
                                Due Amount Deducted
                              </span>
                            )}
                        </td>

                        <td className="px-4 py-3 text-slate-400">
                          {t.created_at}
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
