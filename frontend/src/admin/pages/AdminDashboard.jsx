// src/admin/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";

import AdminLayout from "../layout/AdminLayout";
import Sidebar from "../layout/Sidebar";
import Topbar from "../layout/Topbar";
import StatCard from "../components/StatCard";
import JourneyLineChart from "../components/charts/JourneyLineChart";
import RevenueBarChart from "../components/charts/RevenueBarChart";
import Card from "../components/Card";

import {
  getAdminDashboardStats,
  getUsersWithDue, // ✅ ADDED
} from "../api/adminDashboardApi";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ ADDED STATE
  const [dueUsersCount, setDueUsersCount] = useState(0);

  useEffect(() => {
    Promise.all([
      getAdminDashboardStats(),
      getUsersWithDue(), // ✅ ADDED
    ])
      .then(([statsRes, dueRes]) => {
        setStats(statsRes.data);
        setDueUsersCount(dueRes.data.length);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <Topbar />

          <main className="p-6 space-y-6">
            {/* ================= TOP KPI STATS ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              <StatCard
                title="Total Registered Users"
                value={loading ? "—" : stats.total_users}
                subtitle="All users onboarded"
              />

              <StatCard
                title="Active Buses"
                value={loading ? "—" : stats.active_buses}
                subtitle="Currently running"
              />

              <StatCard
                title="Journeys Today"
                value={loading ? "—" : stats.journeys_today}
                subtitle="Completed & ongoing"
              />

              <StatCard
                title="Fare Collected Today"
                value={loading ? "—" : `₹${stats.fare_today}`}
                subtitle="Today's revenue"
              />

              {/* 🔥 NEW: USERS WITH DUE (ADDED ONLY) */}
              <StatCard
                title="Users With Due"
                value={loading ? "—" : dueUsersCount}
                subtitle="Pending settlements"
                highlight="danger"
              />
            </div>

            {/* ================= ANALYTICS SECTION ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Journey Trend */}
              <Card className="lg:col-span-2">
                <h3 className="font-semibold mb-1">
                  Journey Activity Overview
                </h3>
                <p className="text-sm text-[#94a3b8] mb-4">
                  Number of journeys recorded over time
                </p>

                <JourneyLineChart />
              </Card>

              {/* Revenue Summary */}
              <Card>
                <h3 className="font-semibold mb-1">Revenue Summary</h3>
                <p className="text-sm text-[#94a3b8] mb-4">
                  Fare collection by day
                </p>

                <RevenueBarChart />
              </Card>
            </div>

            {/* ================= SYSTEM INSIGHT ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  System Status
                </h3>

                <div className="space-y-3">
                  {[
                    { label: "Facial Recognition", status: "Running" },
                    { label: "Wallet Service", status: "Active" },
                    { label: "Journey Tracking", status: "Live" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between bg-white/5 px-4 py-2 rounded-lg"
                    >
                      <span className="text-sm text-[#cbd5f5]">
                        {item.label}
                      </span>

                      <span
                        className="text-xs px-2 py-1 rounded-full 
                         bg-green-500/15 text-green-400"
                      >
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <h3 className="font-semibold mb-4">Admin Highlights</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[#94a3b8]">Journeys Today</span>
                    <span className="font-semibold text-white">
                      {loading ? "—" : stats.journeys_today}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#94a3b8]">Active Buses</span>
                    <span className="font-semibold text-white">
                      {loading ? "—" : stats.active_buses}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#94a3b8]">Fare Collected</span>
                    <span className="font-semibold text-violet-400">
                      ₹{loading ? "—" : stats.fare_today}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#94a3b8]">System Alerts</span>
                    <span className="text-green-400 text-xs px-2 py-1 rounded-full bg-green-500/15">
                      None
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </AdminLayout>
  );
}
