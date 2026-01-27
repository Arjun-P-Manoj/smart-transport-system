import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function PassengerBus() {
  const { busId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const currentStopRef = useRef(null);

  /* ================= FETCH BUS ================= */
  useEffect(() => {
    const fetchBus = () => {
      fetch(`http://localhost:5050/api/passenger/bus/${busId}`)
        .then((res) => res.json())
        .then(setData)
        .catch(() => toast.error("Failed to load bus data"));
    };

    fetchBus();
    const interval = setInterval(fetchBus, 2000);
    return () => clearInterval(interval);
  }, [busId]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    if (currentStopRef.current) {
      currentStopRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [data]);

  if (!data) return null;

  const route = data.route;
  const currentIndex = route.findIndex((s) => s.is_current);
  const currentStop = route[currentIndex];
  const nextStop =
    currentIndex !== -1 && currentIndex < route.length - 1
      ? route[currentIndex + 1]
      : null;

  /* ================= FACE ENTRY ================= */
  const handleFaceEntry = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const res = await fetch(
        "http://127.0.0.1:5050/api/passenger/face-entry",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bus_id: Number(busId) }),
        }
      );

      const result = await res.json();

      if (result.success) {
        if (result.message?.toLowerCase().includes("already")) {
          toast.info(result.message);
        } else {
          toast.success(result.message || "Passenger entry successful");
        }
      } else {
        if (result.message?.toLowerCase().includes("due")) {
          toast.warning(result.message);
        } else {
          toast.error(result.message || "Face entry failed");
        }
      }
    } catch (err) {
      toast.error("Face entry server error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FACE EXIT ================= */
  const handleFaceExit = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const res = await fetch(
        "http://127.0.0.1:5050/api/passenger/face-exit",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = await res.json();

      if (result.success) {
        let msg = result.message || "Passenger exit successful";

        if (result.fare !== undefined) {
          msg += ` | Fare ₹${result.fare}`;
        }
        if (result.due > 0) {
          msg += ` | Due ₹${result.due}`;
          toast.warning(msg);
        } else {
          toast.success(msg);
        }
      } else {
        if (result.message?.toLowerCase().includes("not inside")) {
          toast.info(result.message);
        } else {
          toast.warning(result.message || "Face exit failed");
        }
      }
    } catch (err) {
      toast.error("Face exit server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* ================= HERO ================= */}
      <div className="px-8 pt-20 pb-16 text-center">
        <p className="text-xs tracking-widest text-gray-400">
          PASSENGER SIMULATION MODE
        </p>

        <h1 className="mt-6 text-4xl md:text-5xl font-semibold">
          Live Passenger
          <br />
          Journey Simulator
        </h1>

        <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
          Simulate passenger entry and exit using facial recognition while
          monitoring real-time bus movement.
        </p>
      </div>

      {/* ================= BUS INFO ================= */}
      <div className="px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard label="Bus" value={data.bus_number} color="blue" />
          <InfoCard
            label="Current Stop"
            value={currentStop?.stop_name}
            color="green"
          />
          <InfoCard
            label="Next Stop"
            value={nextStop ? nextStop.stop_name : "End"}
            color="yellow"
          />
        </div>
      </div>

      {/* ================= ROUTE MAP ================= */}
      {route.length > 0 && (
        <div className="overflow-x-auto py-8">
          <div className="flex items-center min-w-max px-6">
            {route.map((stop, index) => {
              const isNext = index === currentIndex + 1;
              return (
                <div
                  key={stop.stop_id}
                  ref={stop.is_current ? currentStopRef : null}
                  className="flex items-center"
                >
                  {index !== 0 && <div className="w-20 h-1 bg-gray-700"></div>}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center
                        ${
                          stop.is_current
                            ? "bg-green-400 ring-8 ring-green-300 animate-pulse text-black"
                            : isNext
                            ? "bg-yellow-400 ring-4 ring-yellow-300 text-black"
                            : "bg-gray-600"
                        }`}
                    >
                      {stop.is_current ? "●" : isNext ? "○" : ""}
                    </div>
                    <span
                      className={`mt-3 text-sm w-28 text-center ${
                        stop.is_current
                          ? "text-green-400 font-semibold"
                          : isNext
                          ? "text-yellow-400 font-semibold"
                          : "text-gray-400"
                      }`}
                    >
                      {stop.stop_name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= ACTION BUTTONS ================= */}
      <div className="mt-auto px-8 py-10">
        <div className="max-w-6xl mx-auto flex justify-between">
          <button
            onClick={handleFaceEntry}
            disabled={loading}
            className="bg-green-400/20 text-green-300 border border-green-400/30
              px-12 py-4 rounded-full disabled:opacity-40"
          >
            {loading ? "Scanning..." : "Face Entry"}
          </button>

          <button
            onClick={handleFaceExit}
            disabled={loading}
            className="bg-red-500/20 text-red-300 border border-red-500/30
              px-12 py-4 rounded-full disabled:opacity-40"
          >
            {loading ? "Scanning..." : "Face Exit"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= INFO CARD ================= */
function InfoCard({ label, value, color }) {
  const colors = {
    blue: "text-blue-400 border-blue-500/30",
    green: "text-green-400 border-green-500/40",
    yellow: "text-yellow-400 border-yellow-500/30",
  };

  return (
    <div
      className={`bg-black border rounded-2xl px-6 py-5 text-center ${colors[color]}`}
    >
      <p className="text-xs uppercase tracking-wide">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}
