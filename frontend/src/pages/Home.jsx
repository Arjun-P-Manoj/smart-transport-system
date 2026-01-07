import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="h-full w-full bg-black text-white flex items-center justify-center">
      <div className="max-w-3xl px-6 text-center">
        <p className="text-sm text-gray-400 mb-4">
          📍 Kerala, India • Smart Transport Project
        </p>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Smart Transport System
        </h1>

        <h2 className="text-2xl md:text-3xl text-gray-300 mb-6">
          Cashless & Automated Public Transport
        </h2>

        <p className="text-gray-400 mb-10">
          Facial-recognition based public transport system for automated fare deduction.
        </p>

        <div className="flex justify-center gap-4">
          <Link to="/register">
            <button className="px-6 py-3 rounded-full bg-white text-black">
              Register
            </button>
          </Link>

          <Link to="/login">
            <button className="px-6 py-3 rounded-full border border-gray-600">
              Face Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
