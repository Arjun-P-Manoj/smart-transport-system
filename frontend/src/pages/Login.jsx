import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export default function Login() {
  const navigate = useNavigate()

  const [mobile, setMobile] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!mobile || !password) {
      setStatus("Mobile number and password are required")
      return
    }

    setLoading(true)
    setStatus("Logging in…")

    try {
      const res = await fetch("http://127.0.0.1:5050/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile,
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus(`❌ ${data.error || "Login failed"}`)
      } else {
        // ✅ Save JWT
        localStorage.setItem("token", data.token)

        setStatus("✅ Login successful")
        setTimeout(() => navigate("/dashboard"), 800)
      }
    } catch (err) {
      setStatus("❌ Backend not reachable")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full w-full bg-black text-white flex items-center justify-center">
      <div className="max-w-xl w-full px-6 text-center">

        {/* Back */}
        <Link
          to="/"
          className="text-sm text-gray-400 hover:text-gray-200 block mb-6"
        >
          ← Back to Home
        </Link>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          User Login
        </h1>

        <p className="text-gray-400 mb-10">
          Login using your registered mobile number and password.
        </p>

        {/* Inputs */}
        <div className="space-y-4 mb-8">
          <input
            type="text"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full bg-transparent border border-gray-600 rounded-full px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border border-gray-600 rounded-full px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full md:w-auto px-8 py-3 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Status */}
        {status && (
          <p className="mt-6 text-sm text-gray-400">
            {status}
          </p>
        )}
      </div>
    </div>
  )
}
