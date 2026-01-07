import { useState } from "react"
import { Link } from "react-router-dom"

export default function Login() {
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  const handleFaceLogin = async () => {
    setLoading(true)
    setStatus("Opening camera… Please look at the camera")

    try {
      const res = await fetch("http://127.0.0.1:5000/face-login", {
        method: "POST",
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus("Face not recognized ❌")
      } else {
        setStatus(`Access granted ✅ ${data.message}`)
      }
    } catch {
      setStatus("Backend not reachable ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full w-full bg-black text-white flex items-center justify-center">
      <div className="max-w-xl w-full px-6 text-center">

        {/* Back link */}
        <Link
          to="/"
          className="text-sm text-gray-400 hover:text-gray-200 block mb-6"
        >
          ← Back to Home
        </Link>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Face Login
        </h1>

        <p className="text-gray-400 mb-10">
          Authenticate yourself using facial recognition
          to access the transport system.
        </p>

        {/* Button */}
        <button
          onClick={handleFaceLogin}
          disabled={loading}
          className="px-10 py-3 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify Face"}
        </button>

        {/* Status */}
        {status && (
          <p className="text-sm text-gray-400 mt-6">
            {status}
          </p>
        )}
      </div>
    </div>
  )
}
