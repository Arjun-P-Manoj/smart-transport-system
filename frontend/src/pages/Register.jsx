import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [otp, setOtp] = useState("");

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const aadharRegex = /^\d{12}$/;
  const mobileRegex = /^[6-9]\d{9}$/;

  // ---------------- SEND OTP ----------------
  const sendOtp = async () => {
    if (!name || !mobile || !password || !email || !aadhar) {
      setStatus("❌ Please fill all fields first");
      return;
    }

    if (!mobileRegex.test(mobile)) {
      setStatus("❌ Invalid mobile number");
      return;
    }

    if (!aadharRegex.test(aadhar)) {
      setStatus("❌ Aadhaar must be exactly 12 digits");
      return;
    }

    setStatus("Sending OTP...");

    try {
      const res = await fetch("http://127.0.0.1:5050/send-email-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("✅ OTP sent to your email");
        setStep(2);
      } else {
        setStatus(data.error || "Failed to send OTP");
      }
    } catch {
      setStatus("❌ Backend not reachable");
    }
  };

  // ---------------- VERIFY OTP ----------------
  const verifyOtp = async () => {
    if (!otp) {
      setStatus("❌ Enter OTP");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5050/verify-email-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("✅ OTP verified");
        setStep(3);
      } else {
        setStatus(data.error || "OTP verification failed");
      }
    } catch {
      setStatus("❌ Backend not reachable");
    }
  };

  // ---------------- REGISTER ----------------
  const handleRegister = async () => {
    setLoading(true);
    setStatus("📷 Look at the camera… Capturing face");

    try {
      const res = await fetch("http://127.0.0.1:5050/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          mobile,
          password,
          email,
          aadhar,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(`❌ ${data.error || "Registration failed"}`);
      } else {
        setStatus("✅ Registration successful");
        setTimeout(() => navigate("/login"), 1800);
      }
    } catch {
      setStatus("❌ Backend not reachable");
    }

    setLoading(false);
  };

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
          Register using email OTP and facial recognition for seamless cashless
          public transport access.
        </p>

        {/* STEP 1 - ENTER DETAILS */}
        {step === 1 && (
          <div className="space-y-4 mb-8">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border border-gray-600 rounded-full px-5 py-3"
            />

            <input
              type="text"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full bg-transparent border border-gray-600 rounded-full px-5 py-3"
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-gray-600 rounded-full px-5 py-3"
            />

            <input
              type="text"
              maxLength={12}
              placeholder="Aadhar Number"
              value={aadhar}
              onChange={(e) => setAadhar(e.target.value)}
              className="w-full bg-transparent border border-gray-600 rounded-full px-5 py-3"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-gray-600 rounded-full px-5 py-3"
            />

            <button
              onClick={sendOtp}
              className="w-full px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500"
            >
              Send OTP
            </button>
          </div>
        )}

        {/* STEP 2 - OTP */}
        {step === 2 && (
          <div className="space-y-4 mb-8">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-transparent border border-gray-600 rounded-full px-5 py-3"
            />

            <button
              onClick={verifyOtp}
              className="w-full px-8 py-3 rounded-full bg-green-600 hover:bg-green-500"
            >
              Verify OTP
            </button>
          </div>
        )}

        {/* STEP 3 - REGISTER */}
        {step === 3 && (
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full md:w-auto px-8 py-3 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition"
          >
            {loading ? "Registering..." : "Register & Capture Face"}
          </button>
        )}

        {/* Status */}
        {status && (
          <p className="mt-6 text-sm text-gray-400 animate-pulse">{status}</p>
        )}
      </div>
    </div>
  );
}
