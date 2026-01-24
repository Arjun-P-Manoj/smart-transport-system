import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PassengerHome() {
  const [buses, setBuses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBuses = () => {
      fetch("http://localhost:5050/api/passenger/buses")
        .then((res) => res.json())
        .then(setBuses)
        .catch(console.error);
    };

    fetchBuses();
    const interval = setInterval(fetchBuses, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* 🔥 HERO SECTION */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/40 to-black"></div>

        <div className="relative px-6 pt-20 pb-24 max-w-6xl mx-auto text-center">
          <p className="text-sm text-gray-400 tracking-wide">
            SMART PUBLIC TRANSPORT SYSTEM
          </p>

          <h1 className="mt-4 text-4xl md:text-5xl font-semibold leading-tight">
            Seamless Passenger <br /> Journey Experience
          </h1>

          <p className="mt-5 text-gray-400 max-w-2xl mx-auto">
            Experience a modern, contactless public transport system with
            real-time tracking and intelligent passenger flow.
          </p>

          {/* CTA */}
          <div className="mt-10 flex justify-center">
            <div className="flex items-center bg-white text-black rounded-full px-6 py-3 font-medium gap-3">
              <span className="bg-black text-white w-10 h-10 flex items-center justify-center rounded-full">
                →
              </span>
              <span>Start Your Journey</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🚍 JOURNEY LIST */}
      <div className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-xl font-semibold mb-6">
            Available Journeys
          </h2>

          <div className="space-y-4">
            {buses.map((bus) => (
              <div
                key={bus.bus_id}
                onClick={() => navigate(`/passenger/bus/${bus.bus_id}`)}
                className="cursor-pointer bg-linear-to-r from-gray-900 to-black
                border border-gray-800 rounded-2xl px-6 py-5
                hover:border-green-400 transition"
              >
                {/* TOP ROW */}
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-sm text-gray-400">Bus</p>
                    <p className="text-lg font-semibold">
                      {bus.bus_number}
                    </p>
                  </div>

                  <span className="text-xs bg-green-500 text-black px-3 py-1 rounded-full">
                    LIVE
                  </span>
                </div>

                {/* FROM → TO */}
                <div className="flex items-center gap-4 text-lg font-medium">
                  <span>{bus.from_stop}</span>
                  <span className="text-gray-500">→</span>
                  <span>{bus.to_stop}</span>
                </div>

                {/* FOOTER */}
                <div className="flex justify-between items-center mt-4 text-sm">
                  <span className="text-gray-400">
                    Current Stop:{" "}
                    <span className="text-white">
                      {bus.current_stop}
                    </span>
                  </span>

                  <span className="text-green-400 font-medium">
                    View →
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
