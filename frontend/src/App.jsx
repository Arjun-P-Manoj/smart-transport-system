import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ================= USER PAGES ================= */
import Home from "./pages/Home";
import Register from "./pages/Register";
import FaceLogin from "./pages/FaceLogin";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard";
import DriverDashboard from "./pages/DriverDashboard";
import PassengerSimulation from "./pages/passenger";
import PassengerBusView from "./pages/passengerBus";

/* ================= ADMIN ================= */
import AdminLogin from "./admin/auth/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import RequireAdminAuth from "./admin/auth/RequireAdminAuth";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminJourneys from "./admin/pages/AdminJourneys";
import AdminWallet from "./admin/pages/AdminWallet";
import AdminBuses from "./admin/pages/AdminBuses";
import AdminTransactions from "./admin/pages/AdminTransactions";
import AdminManageTransport from "./admin/pages/AdminManageTransport";

export default function App() {
  return (
    <>
      {/* 🔔 GLOBAL TOAST NOTIFICATIONS */}
      <ToastContainer
        position="top-right"
        autoClose={7000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />

      {/* 🚦 APPLICATION ROUTES */}
      <Routes>
        {/* ---------- PUBLIC / USER ROUTES ---------- */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/facelogin" element={<FaceLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/driver" element={<DriverDashboard />} />
        <Route path="/passenger" element={<PassengerSimulation />} />
        <Route path="/passenger/bus/:busId" element={<PassengerBusView />} />

        {/* ---------- ADMIN ROUTES ---------- */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin/dashboard"
          element={
            <RequireAdminAuth>
              <AdminDashboard />
            </RequireAdminAuth>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RequireAdminAuth>
              <AdminUsers />
            </RequireAdminAuth>
          }
        />
        <Route
          path="/admin/journeys"
          element={
            <RequireAdminAuth>
              <AdminJourneys />
            </RequireAdminAuth>
          }
        />

        <Route
          path="/admin/wallet"
          element={
            <RequireAdminAuth>
              <AdminWallet />
            </RequireAdminAuth>
          }
        />

        <Route
          path="/admin/buses"
          element={
            <RequireAdminAuth>
              <AdminBuses />
            </RequireAdminAuth>
          }
        />

        <Route
          path="/admin/transactions"
          element={
            <RequireAdminAuth>
              <AdminTransactions />
            </RequireAdminAuth>
          }
        />
        <Route
          path="/admin/manage-transport"
          element={
            <RequireAdminAuth>
              <AdminManageTransport />
            </RequireAdminAuth>
          }
        />

        {/* ---------- FALLBACK ---------- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
