import { useEffect, useRef, useState } from "react";

export default function DriverDashboard() {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [route, setRoute] = useState([]);
  const [status, setStatus] = useState("");

  // 🔹 REF FOR AUTO-SCROLL
  const currentStopRef = useRef(null);

  // Fetch buses
  useEffect(() => {
    fetch("http://localhost:5050/api/driver/buses")
      .then((res) => res.json())
      .then(setBuses)
      .catch(console.error);
  }, []);

  // Fetch route
  const fetchRoute = (busId) => {
    fetch(`http://localhost:5050/api/journey/bus/${busId}/route`)
      .then((res) => res.json())
      .then(setRoute)
      .catch(console.error);
  };

  const loadRoute = (bus) => {
    setSelectedBus(bus);
    setStatus("");
    fetchRoute(bus.bus_id);
  };

  const moveNext = () => {
    setStatus("Moving to next stop...");
    fetch(
      `http://localhost:5050/api/driver/bus/${selectedBus.bus_id}/next-stop`,
      { method: "POST" }
    ).then(() => {
      fetchRoute(selectedBus.bus_id);
      setTimeout(() => setStatus("Bus reached next stop"), 500);
    });
  };

  const resetRoute = () => {
    fetch(`http://localhost:5050/api/driver/bus/${selectedBus.bus_id}/reset`, {
      method: "POST",
    }).then(() => {
      fetchRoute(selectedBus.bus_id);
    });
  };

  // 🔹 Helper logic
  const currentIndex = route.findIndex((s) => s.is_current);
  const currentStop = route[currentIndex];
  const nextStop =
    currentIndex !== -1 && currentIndex < route.length - 1
      ? route[currentIndex + 1]
      : null;

  const isLastStop = currentIndex === route.length - 1;

  // 🔹 AUTO-SCROLL TO CURRENT STOP
  useEffect(() => {
    if (currentStopRef.current) {
      currentStopRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentIndex]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-6xl">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-gray-400 text-sm">🚍 Smart Transport System</p>
          <h1 className="text-3xl font-semibold">Driver Route Console</h1>
          <p className="text-gray-500 mt-2">
            Live metro-style route visualization
          </p>
        </div>

        {/* Bus Selector */}
        <div className="flex justify-center mb-8">
          <div className="relative w-80">
            <select
              className="w-full appearance-none bg-linear-to-r from-gray-900 to-black
                border border-gray-700 rounded-full px-6 py-3 text-white font-medium
                shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const bus = buses.find(
                  (b) => b.bus_id === Number(e.target.value)
                );
                if (bus) loadRoute(bus);
              }}
            >
              <option value="">Select Bus</option>
              {buses.map((bus) => (
                <option key={bus.bus_id} value={bus.bus_id}>
                  {bus.bus_number} • {bus.number_plate}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
              ▼
            </div>
          </div>
        </div>

        {/* CURRENT → NEXT PANEL */}
        {currentStop && (
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <p className="text-sm text-gray-400">Current Stop</p>
              <p className="text-xl font-bold text-green-400">
                {currentStop.stop_name}
              </p>
            </div>

            <div className="flex items-center text-gray-500 text-2xl">→</div>

            <div className="text-center">
              <p className="text-sm text-gray-400">Next Stop</p>
              <p className="text-xl font-bold text-yellow-400">
                {nextStop ? nextStop.stop_name : "No Further Stops"}
              </p>
            </div>
          </div>
        )}

        {/* Metro Route */}
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
                    {index !== 0 && (
                      <div className="w-20 h-1 bg-gray-700"></div>
                    )}

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

        {/* Buttons */}
        {selectedBus && (
          <div className="flex justify-center mt-10 gap-4">
            {!isLastStop && (
              <button
                onClick={moveNext}
                className="bg-white text-black px-10 py-3 rounded-full font-medium hover:bg-gray-200 transition"
              >
                Move to Next Stop
              </button>
            )}

            {isLastStop && (
              <button
                onClick={resetRoute}
                className="bg-red-600 text-white px-10 py-3 rounded-full font-medium hover:bg-red-500 transition"
              >
                Reset Route
              </button>
            )}
          </div>
        )}

        {status && (
          <p className="mt-4 text-center text-sm text-blue-400">{status}</p>
        )}
      </div>
    </div>
  );
}
