import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function PassengerBus() {
  const { busId } = useParams();
  const [data, setData] = useState(null);

  // 🔹 ONLY loading state (no insideBus state)
  const [loading, setLoading] = useState(false);

  const currentStopRef = useRef(null);

  /* ================= FETCH BUS ================= */
  useEffect(() => {
    const fetchBus = () => {
      fetch(`http://localhost:5050/api/passenger/bus/${busId}`)
        .then((res) => res.json())
        .then(setData)
        .catch(console.error);
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
    try {
      setLoading(true);

      const res = await fetch(
        "http://127.0.0.1:5050/api/passenger/face-entry",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bus_id: Number(busId) }),
        },
      );

      const result = await res.json();

      if (result.success) {
        if (result.message?.toLowerCase().includes("already")) {
          toast.info(result.message);
        } else {
          toast.success(result.message);
        }
      } else {
        toast.error(result.message || "Face entry failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Face entry error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FACE EXIT ================= */
  const handleFaceExit = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:5050/api/passenger/face-exit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bus_id: Number(busId) }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.warning(result.message || "Face exit failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Face exit error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* ================= HERO / JOURNEY INFO ================= */}
      <div className="px-8 pt-20 pb-16 text-center">
        <p className="text-xs tracking-widest text-gray-400">
          PASSENGER SIMULATION MODE
        </p>

        <h1 className="mt-6 text-4xl md:text-5xl font-semibold leading-tight">
          Live Passenger
          <br />
          Journey Simulator
        </h1>

        <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
          Simulate passenger entry and exit using facial recognition while
          monitoring real-time bus movement and route progression.
        </p>
      </div>

      {/* ================= BUS INFO STRIP ================= */}
      <div className="px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black border border-blue-500/30 rounded-2xl px-6 py-5 text-center">
            <p className="text-xs uppercase text-blue-400 tracking-wide">Bus</p>
            <p className="text-xl font-semibold text-blue-300">
              {data.bus_number}
            </p>
          </div>

          <div
            className="bg-black border border-green-500/40 rounded-2xl px-6 py-5 text-center
            shadow-[0_0_20px_rgba(74,222,128,0.15)]"
          >
            <p className="text-xs uppercase text-green-400 tracking-wide">
              Current Stop
            </p>
            <p className="text-xl font-semibold text-green-400">
              {currentStop?.stop_name}
            </p>
          </div>

          <div className="bg-black border border-yellow-500/30 rounded-2xl px-6 py-5 text-center">
            <p className="text-xs uppercase text-yellow-400 tracking-wide">
              Next Stop
            </p>
            <p className="text-xl font-semibold text-yellow-300">
              {nextStop ? nextStop.stop_name : "End"}
            </p>
          </div>
        </div>
      </div>

      {/* ================= METRO ROUTE ================= */}
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
                        }
                      `}
                    >
                      {stop.is_current ? "●" : isNext ? "○" : ""}
                    </div>

                    <span
                      className={`mt-3 text-sm w-28 text-center
                        ${
                          stop.is_current
                            ? "text-green-400 font-semibold"
                            : isNext
                              ? "text-yellow-400 font-semibold"
                              : "text-gray-400"
                        }
                      `}
                    >
                      {stop.stop_name}
                    </span>

                    <div className="mt-1 flex gap-1 flex-wrap justify-center">
                      {index === 0 && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                          START
                        </span>
                      )}
                      {index === route.length - 1 && (
                        <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
                          END
                        </span>
                      )}
                      {stop.is_current && (
                        <span className="text-xs bg-green-500 text-black px-2 py-0.5 rounded-full">
                          CURRENT
                        </span>
                      )}
                      {isNext && (
                        <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full">
                          NEXT
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= ACTIONS ================= */}
      <div className="mt-auto px-8 py-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button
            onClick={handleFaceEntry}
            disabled={loading}
            className="bg-green-400/20 text-green-300
              border border-green-400/30
              px-12 py-4 rounded-full font-medium
              hover:bg-green-400/30 transition
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Scanning..." : "Face Entry"}
          </button>

          <button
            onClick={handleFaceExit}
            disabled={loading}
            className="bg-gray-500/20 text-gray-300
              border border-gray-500/30
              px-12 py-4 rounded-full font-medium
              hover:bg-gray-500/30 transition
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Scanning..." : "Face Exit"}
          </button>
        </div>
      </div>
    </div>
  );
}
