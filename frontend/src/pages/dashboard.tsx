import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

/* ---------------- TYPES ---------------- */
type DashboardData = {
  name: string;
  wallet_balance: number;
  face_registered: boolean;
  due: {
    amount: number;
    source: string;
    destination: string;
  } | null;
};

type Journey = {
  bus: string;
  source: string;
  destination: string;
  date: string;
  fare: number | string;
};

type WalletTx = {
  timestamp: string;
  type: "DEBIT" | "CREDIT";
  amount: number;
  status: string;
};

const API = "http://127.0.0.1:5050";

/* ================= COMPONENT ================= */

export default function Dashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "journey" | "wallet"
  >("dashboard");

  const [data, setData] = useState<DashboardData | null>(null);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [transactions, setTransactions] = useState<WalletTx[]>([]);
  const [search, setSearch] = useState("");
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [showFaceModal, setShowFaceModal] = useState(false);
  const [faceLoading, setFaceLoading] = useState(false);

  /* ---------------- FETCH ALL ---------------- */

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchAll = async () => {
      try {
        const [dashRes, journeyRes, walletRes] = await Promise.all([
          fetch(`${API}/dashboard`, {
            headers: { Authorization: "Bearer " + token },
          }),
          fetch(`${API}/dashboard/journeys`, {
            headers: { Authorization: "Bearer " + token },
          }),
          fetch(`${API}/api/wallet/transactions`, {
            headers: { Authorization: "Bearer " + token },
          }),
        ]);

        setData(await dashRes.json());
        setJourneys(await journeyRes.json());
        setTransactions(await walletRes.json());
      } catch {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchAll();
  }, [navigate]);

  if (!data) {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  /* ---------------- DERIVED DATA ---------------- */

  const totalFare = journeys.reduce((sum, j) => sum + Number(j.fare || 0), 0);

  const totalSpent = transactions
    .filter((t) => t.type === "DEBIT")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalRecharges = transactions
    .filter((t) => t.type === "CREDIT")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const filteredJourneys = journeys.filter((j) =>
    `${j.bus} ${j.source} ${j.destination}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  /* ---------------- ACTIONS ---------------- */

  const handleReRegisterFace = async () => {
    if (faceLoading) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setFaceLoading(true);

      const res = await fetch(`${API}/re-register-face`, {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      toast.success("Face re-registered successfully ✅");
      setData((p) => (p ? { ...p, face_registered: true } : p));
      setShowFaceModal(false);
    } catch (e: any) {
      toast.error(e.message || "Face re-registration failed");
    } finally {
      setFaceLoading(false);
    }
  };

  const handleRecharge = async () => {
    if (!rechargeAmount) return toast.warning("Enter recharge amount");

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API}/api/wallet/recharge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ amount: Number(rechargeAmount) }),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      toast.success("Wallet recharged successfully 💳");
      setData((p) =>
        p ? { ...p, wallet_balance: result.current_balance } : p,
      );
      setRechargeAmount("");
    } catch (e: any) {
      toast.error(e.message || "Recharge failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="flex h-screen bg-black text-white">
      {/* SIDEBAR */}
      <aside className="w-64 bg-zinc-950 border-r border-zinc-800 p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-indigo-400 mb-10">
          Smart Transport
        </h2>

        <nav className="space-y-4 text-sm flex-1">
          {["dashboard", "journey", "wallet"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t as any)}
              className={`block w-full text-left ${
                activeTab === t
                  ? "text-indigo-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
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

      {/* MAIN */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            <h1 className="text-3xl font-bold mb-6">Hey {data.name} 👋</h1>

            <div className="grid md:grid-cols-4 gap-6 mb-10">
              <Stat title="Total Trips" value={journeys.length} />
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

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8 flex justify-between">
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

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
              <h2 className="font-semibold mb-4">Journey Analytics</h2>
              <div className="h-40 flex items-center justify-center text-gray-500">
                📊 Chart (Trips / Fare over time)
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="font-semibold mb-4">Last Journey Timeline</h2>
              <ul className="space-y-3 text-sm">
                {journeys[0] ? (
                  <>
                    <li>🟢 Entry – {journeys[0].source}</li>
                    <li>🔴 Exit – {journeys[0].destination}</li>
                    <li className="text-green-400">
                      Fare Deducted – ₹ {journeys[0].fare}
                    </li>
                  </>
                ) : (
                  <li className="text-gray-500">No journeys yet</li>
                )}
              </ul>
            </div>
          </>
        )}

        {/* JOURNEY */}
        {activeTab === "journey" && (
          <>
            <h1 className="text-2xl font-bold mb-6">Journey History</h1>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search journey..."
              className="w-full mb-6 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2"
            />

            <Table
              headers={["Bus", "From", "To", "Date", "Fare"]}
              rows={filteredJourneys.map((j) => [
                j.bus,
                j.source,
                j.destination,
                j.date,
                `₹ ${Number(j.fare)}`,
              ])}
            />
          </>
        )}

        {/* WALLET */}
        {activeTab === "wallet" && (
          <>
            <h1 className="text-2xl font-bold mb-6">Wallet</h1>

            {/* 🔔 REAL PENDING DUE INDICATOR (SOURCE OF TRUTH) */}
            {data.due && (
              <div className="mb-6 bg-yellow-900/30 border border-yellow-600 rounded-xl p-4">
                <p className="font-semibold text-yellow-400">
                  ⚠️ Pending Due Detected
                </p>
                <p className="text-sm text-gray-300">
                  ₹{data.due.amount} due for journey from{" "}
                  <b>{data.due.source}</b> to <b>{data.due.destination}</b>.
                  This will be auto-deducted on your next wallet recharge.
                </p>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <Stat
                title="Available Balance"
                value={`₹ ${data.wallet_balance}`}
                accent="text-green-400"
              />
              <Stat title="Total Spent" value={`₹ ${totalSpent}`} />
              <Stat title="Total Recharges" value={`₹ ${totalRecharges}`} />
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
              <h2 className="font-semibold mb-4">Recharge Wallet</h2>
              <div className="flex gap-4">
                <input
                  type="number"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  className="flex-1 bg-black border border-zinc-700 rounded-lg px-4 py-2"
                  placeholder="Enter amount"
                />
                <button
                  onClick={handleRecharge}
                  className="bg-indigo-600 px-6 py-2 rounded-lg"
                >
                  Recharge
                </button>
              </div>
            </div>

            <Table
              headers={["Date", "Type", "Amount", "Status"]}
              rows={transactions.map((t) => [
                t.timestamp,
                t.type,
                <span
                  className={
                    t.type === "CREDIT"
                      ? "text-green-400"
                      : t.status.toLowerCase().includes("due")
                        ? "text-orange-400"
                        : "text-red-400"
                  }
                >
                  {t.type === "DEBIT" ? "-" : "+"} ₹{t.amount}
                </span>,
                <span
                  className={
                    t.status.toLowerCase().includes("due")
                      ? "text-orange-400 font-semibold"
                      : t.type === "CREDIT"
                        ? "text-green-400"
                        : "text-red-400"
                  }
                >
                  {t.status.toLowerCase().includes("due") && "⚠️ "}
                  {t.status}
                </span>,
              ])}
            />
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
                className="bg-indigo-600 px-4 py-2 rounded-lg"
              >
                {faceLoading ? "Capturing..." : "Start Capture"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- SHARED ---------------- */

function Stat({ title, value, accent = "text-white" }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <p className="text-gray-400 text-sm mb-2">{title}</p>
      <p className={`text-2xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}

function Table({ headers, rows }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-zinc-800 text-gray-400">
          <tr>
            {headers.map((h: string) => (
              <th key={h} className="p-3 text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r: any[], i: number) => (
            <tr key={i} className="border-t border-zinc-800">
              {r.map((c, j) => (
                <td key={j} className="p-3">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
