import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export default function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [mobile, setMobile] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!name || !mobile || !password) {
      setStatus("❌ All fields are required")
      return
    }

    setLoading(true)
    setStatus("📷 Look at the camera… Capturing face")

    try {
      const res = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          mobile,
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus(`❌ ${data.error || "Registration failed"}`)
      } else {
        setStatus("✅ Registration successful. Face stored")
        setTimeout(() => navigate("/login"), 1800)
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

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          User Registration
        </h1>

        <p className="text-gray-400 mb-8">
          Register using your mobile number and facial recognition
          for seamless cashless public transport access.
        </p>

        {/* Inputs */}
        <div className="space-y-4 mb-8">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent border border-gray-600 rounded-full px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400"
          />

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
          onClick={handleRegister}
          disabled={loading}
          className="w-full md:w-auto px-8 py-3 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition disabled:opacity-60"
        >
          {loading ? "Registering..." : "Register & Capture Face"}
        </button>

        {/* Status */}
        {status && (
          <p className="mt-6 text-sm text-gray-400 animate-pulse">
            {status}
          </p>
        )}
      </div>
    </div>
  )
}
