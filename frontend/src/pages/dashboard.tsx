import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type DashboardData = {
  name: string;
  wallet_balance: number;
  face_registered: boolean;
};

type Journey = {
  bus: string;
  source: string;
  destination: string;
  date: string;
  fare: number;
};

export default function Dashboard() {
  const navigate = useNavigate();``
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "journey" | "wallet"
  >("dashboard");
  const [data, setData] = useState<DashboardData | null>(null);
  const [search, setSearch] = useState("");
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [showFaceModal, setShowFaceModal] = useState(false);
  const [faceLoading, setFaceLoading] = useState(false);

  const handleReRegisterFace = async () => {
    if (faceLoading) return; // 🔒 HARD GUARD (prevents double click)

    const token = localStorage.getItem("token");
    if (!token) return;

    setFaceLoading(true); // 🔒 LOCK BUTTON IMMEDIATELY

    try {
      const res = await fetch("http://127.0.0.1:5000/re-register-face", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "Face update failed");
        return;
      }

      alert("Face updated successfully ✅");
      setShowFaceModal(false);

      // Refresh dashboard state
      setData((prev) => (prev ? { ...prev, face_registered: true } : prev));
    } catch {
      alert("Server error");
    } finally {
      setFaceLoading(false); // 🔓 UNLOCK AFTER REQUEST COMPLETES
    }
  };

  /* ---------------- DUMMY DATA ---------------- */
  const journeys: Journey[] = [
    {
      bus: "KSRTC Swift",
      source: "Thrissur",
      destination: "Kochi",
      date: "2026-01-10",
      fare: 120,
    },
    {
      bus: "City Bus",
      source: "Irinjalakuda",
      destination: "Thrissur",
      date: "2026-01-08",
      fare: 35,
    },
  ];

  const totalFare = journeys.reduce((s, j) => s + j.fare, 0);

  const filteredJourneys = journeys.filter((j) =>
    `${j.bus} ${j.source} ${j.destination}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  /* ---------------- FETCH DASHBOARD ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/dashboard", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        const result = await res.json();
        setData(result);
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (!data) {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-white">
      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="w-64 bg-zinc-950 border-r border-zinc-800 p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-indigo-400 mb-10">
          Smart Transport
        </h2>

        <nav className="space-y-4 text-sm flex-1">
          <NavItem
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <NavItem
            label="Journey"
            active={activeTab === "journey"}
            onClick={() => setActiveTab("journey")}
          />
          <NavItem
            label="Wallet"
            active={activeTab === "wallet"}
            onClick={() => setActiveTab("wallet")}
          />
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="text-red-400 text-sm"
        >
          Logout
        </button>
      </aside>

      {/* ---------------- MAIN ---------------- */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* DASHBOARD HOME */}
        {activeTab === "dashboard" && (
          <>
            <h1 className="text-3xl font-bold mb-6">Hey {data.name} 👋</h1>

            {/* STATS */}
            <div className="grid md:grid-cols-4 gap-6 mb-10">
              <Stat title="Total Trips" value={journeys.length.toString()} />
              <Stat title="Total Fare Spent" value={`₹ ${totalFare}`} />
              <Stat
                title="Wallet Balance"
                value={`₹ ${data.wallet_balance}`}
                accent="text-green-400"
              />
              <Stat
                title="Face Status"
                value={data.face_registered ? "Registered" : "Not Registered"}
                accent={
                  data.face_registered ? "text-green-400" : "text-yellow-400"
                }
              />
            </div>

            {/* FACE ACTION */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8 flex justify-between items-center">
              <div>
                <p className="font-semibold">Face Recognition</p>
                <p className="text-gray-400 text-sm">
                  Update facial data if appearance changes
                </p>
              </div>
              <button
                onClick={() => setShowFaceModal(true)}
                className="bg-indigo-600 px-4 py-2 rounded-lg"
              >
                Re-Register Face
              </button>
            </div>

            {/* CHART */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
              <h2 className="font-semibold mb-4">Journey Analytics</h2>
              <div className="h-40 flex items-center justify-center text-gray-500">
                📊 Chart (Trips / Fare over time)
              </div>
            </div>

            {/* ENTRY / EXIT TIMELINE */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="font-semibold mb-4">Last Journey Timeline</h2>
              <ul className="space-y-3 text-sm">
                <li>🟢 Entry – Thrissur – 10:30 AM</li>
                <li>🔴 Exit – Kochi – 12:10 PM</li>
                <li className="text-green-400">Fare Deducted – ₹120</li>
              </ul>
            </div>
          </>
        )}

        {/* JOURNEY TAB */}
        {activeTab === "journey" && (
          <>
            <h1 className="text-2xl font-bold mb-6">Journey History</h1>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search journey..."
              className="w-full mb-6 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2"
            />

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-zinc-800 text-gray-400">
                  <tr>
                    <th className="p-3">Bus</th>
                    <th className="p-3">From</th>
                    <th className="p-3">To</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Fare</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJourneys.map((j, i) => (
                    <tr key={i} className="border-t border-zinc-800">
                      <td className="p-3">{j.bus}</td>
                      <td className="p-3">{j.source}</td>
                      <td className="p-3">{j.destination}</td>
                      <td className="p-3">{j.date}</td>
                      <td className="p-3 text-green-400">₹ {j.fare}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* WALLET TAB */}
        {activeTab === "wallet" && (
          <>
            <h1 className="text-2xl font-bold mb-6">Wallet</h1>

            {/* WALLET STATS */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <Stat
                title="Available Balance"
                value={`₹ ${data.wallet_balance}`}
                accent="text-green-400"
              />
              <Stat title="Total Spent" value="₹ 195" />
              <Stat title="Total Recharges" value="₹ 300" />
            </div>

            {/* RECHARGE SECTION */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
              <h2 className="font-semibold mb-4">Recharge Wallet</h2>

              {/* QUICK AMOUNTS */}
              <div className="flex gap-3 mb-4 flex-wrap">
                {[100, 200, 500, 1000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setRechargeAmount(amount.toString())}
                    className="px-4 py-2 rounded-lg border border-zinc-700 text-sm hover:bg-indigo-600 transition"
                  >
                    ₹ {amount}
                  </button>
                ))}
              </div>

              {/* INPUT */}
              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  className="flex-1 bg-black border border-zinc-700 rounded-lg px-4 py-2"
                />
                <button className="bg-indigo-600 px-6 py-2 rounded-lg">
                  Recharge
                </button>
              </div>

              <p className="text-gray-400 text-sm mt-3">
                Supported methods: UPI, Card (UI only)
              </p>
            </div>

            {/* WALLET HISTORY */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <h2 className="font-semibold p-6 border-b border-zinc-800">
                Wallet Transactions
              </h2>

              <table className="w-full text-sm">
                <thead className="bg-zinc-800 text-gray-400">
                  <tr>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Type</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-zinc-800">
                    <td className="p-3">2026-01-10</td>
                    <td className="p-3">Fare Deduction</td>
                    <td className="p-3 text-red-400">- ₹120</td>
                    <td className="p-3 text-green-400">Success</td>
                  </tr>
                  <tr className="border-t border-zinc-800">
                    <td className="p-3">2026-01-08</td>
                    <td className="p-3">Recharge</td>
                    <td className="p-3 text-green-400">+ ₹200</td>
                    <td className="p-3 text-green-400">Success</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      {/* FACE MODAL */}
      {showFaceModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 w-96">
            <h2 className="font-semibold mb-4">Re-Register Face</h2>
            <p className="text-gray-400 text-sm mb-6">
              Please look at the camera to capture your face again.
            </p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowFaceModal(false)}>Cancel</button>
              <button
                onClick={handleReRegisterFace}
                disabled={faceLoading}
                className={`px-4 py-2 rounded-lg ${
                  faceLoading
                    ? "bg-indigo-400 opacity-60 cursor-not-allowed"
                    : "bg-indigo-600"
                }`}
              >
                {faceLoading ? "Capturing Face..." : "Start Capture"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function NavItem({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-left ${
        active ? "text-indigo-400" : "text-gray-400 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function Stat({ title, value, accent = "text-white" }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <p className="text-gray-400 text-sm mb-2">{title}</p>
      <p className={`text-2xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}
