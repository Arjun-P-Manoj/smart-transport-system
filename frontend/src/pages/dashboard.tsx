import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

type DashboardData = {
  user_id: number
  name: string
  mobile: string
  wallet_balance: number
  face_registered: boolean
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      navigate("/login")
      return
    }

    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/dashboard", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })

        const result = await res.json()

        if (!res.ok) {
          throw new Error(result.error || "Failed to load dashboard")
        }

        setData(result)
      } catch (err: any) {
        setError(err.message)
        localStorage.removeItem("token")
        navigate("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [navigate])

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Loading dashboard…
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-red-400">
        {error}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <button
          onClick={logout}
          className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* User Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <p><span className="text-gray-400">Name:</span> {data?.name}</p>
          <p><span className="text-gray-400">Mobile:</span> {data?.mobile}</p>
          <p><span className="text-gray-400">User ID:</span> {data?.user_id}</p>
        </div>

        <div className="border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Wallet</h2>
          <p className="text-2xl font-bold text-green-400">
            ₹ {data?.wallet_balance}
          </p>
        </div>
      </div>

      {/* Face Status */}
      <div className="mt-8 border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-2">Face Registration</h2>

        {data?.face_registered ? (
          <p className="text-green-400">✅ Face registered</p>
        ) : (
          <p className="text-yellow-400">
            ⚠️ Face not registered. Please register face.
          </p>
        )}
      </div>
    </div>
  )
}
