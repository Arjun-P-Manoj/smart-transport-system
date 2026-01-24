import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Register from "./pages/Register";
import FaceLogin from "./pages/FaceLogin";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard";
import DriverDashboard from "./pages/DriverDashboard";
import PassengerSimulation from "./pages/passenger";
import PassengerBusView from "./pages/passengerBus";

export default function App() {
  return (
    <>
      {/* 🔔 Toast Notifications (GLOBAL) */}
      <ToastContainer
        position="top-right"
        autoClose={7000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />

      {/* 🚦 Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/facelogin" element={<FaceLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/driver" element={<DriverDashboard />} />
        <Route path="/passenger" element={<PassengerSimulation />} />
        <Route path="/passenger/bus/:busId" element={<PassengerBusView />} />
      </Routes>
    </>
  );
}
