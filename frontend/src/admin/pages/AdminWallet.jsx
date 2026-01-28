import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import Sidebar from "../layout/Sidebar";
import Topbar from "../layout/Topbar";
import {
  getAdminWallets,
  getAdminTransactions,
} from "../api/adminDashboardApi";

export default function AdminWallet() {
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getAdminWallets().then((res) => setWallets(res.data));
    getAdminTransactions().then((res) => setTransactions(res.data));
  }, []);

  return (
    <AdminLayout>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Topbar />

          <main className="p-6 space-y-8">
            <h1 className="text-xl font-semibold text-white">
              Wallet & Transactions
            </h1>

            {/* WALLET BALANCES */}
            <div
              style={{ backgroundColor: "#111827" }}
              className="rounded-xl overflow-hidden shadow-lg"
            >
              <table className="w-full text-sm text-left">
                <thead style={{ backgroundColor: "#0f1424" }}>
                  <tr className="text-slate-300">
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Mobile</th>
                    <th className="px-4 py-3">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {wallets.map((w) => (
                    <tr
                      key={w.user_id}
                      className="border-t border-white/5 hover:bg-white/5"
                    >
                      <td className="px-4 py-3 text-white">{w.name}</td>
                      <td className="px-4 py-3 text-slate-300">{w.mobile}</td>
                      <td className="px-4 py-3 text-slate-300">₹{w.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* TRANSACTIONS */}
            <div
              style={{ backgroundColor: "#111827" }}
              className="rounded-xl overflow-hidden shadow-lg"
            >
              <table className="w-full text-sm text-left">
                <thead style={{ backgroundColor: "#0f1424" }}>
                  <tr className="text-slate-300">
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Reason</th>
                    <th className="px-4 py-3">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr
                      key={t.transaction_id}
                      className="border-t border-white/5 hover:bg-white/5"
                    >
                      <td className="px-4 py-3 text-white">{t.user_name}</td>
                      <td className="px-4 py-3 text-slate-300">₹{t.amount}</td>
                      <td className="px-4 py-3">
                        {t.type === "DEBIT" ? (
                          <span className="text-red-400">Debit</span>
                        ) : (
                          <span className="text-green-400">Credit</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-300">{t.reason}</td>
                      <td className="px-4 py-3 text-slate-400">{t.created_at}</td>
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
