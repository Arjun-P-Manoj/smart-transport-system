// src/admin/auth/AdminLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "admin") {
      localStorage.setItem("admin_auth", "true");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid administrator credentials");
    }
  };

  return (
    <div
      style={{ backgroundColor: "#0b0f19" }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div
        style={{ backgroundColor: "#121826" }}
        className="w-full max-w-md rounded-xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-lg bg-[#4f46e5] flex items-center justify-center">
            <ShieldCheck size={26} className="text-white" />
          </div>

          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Administrator Access
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Smart Transport System
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-md bg-red-500/10 px-4 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="
                w-full rounded-md px-4 py-2.5
                bg-[#0f1424] text-white
                border border-[#1f2937]
                outline-none
                focus:border-[#4f46e5]
              "
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="
                w-full rounded-md px-4 py-2.5
                bg-[#0f1424] text-white
                border border-[#1f2937]
                outline-none
                focus:border-[#4f46e5]
              "
            />
          </div>

          <button
            type="submit"
            className="
              w-full mt-2 rounded-md py-2.5
              font-semibold text-white
              bg-[#4f46e5]
              hover:bg-[#4338ca]
              transition
            "
          >
            Sign in
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            Authorized administrators only
          </p>
        </div>
      </div>
    </div>
  );
}
