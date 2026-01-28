import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import Sidebar from "../layout/Sidebar";
import Topbar from "../layout/Topbar";
import Card from "../components/Card";

import {
  createRoute,
  addRouteStops,
  createBus,
  activateBus,
  getAdminBuses,
  assignRouteToBus,
  getAdminRoutes,
} from "../api/adminDashboardApi";

export default function AdminManageTransport() {
  /* ================= BUS ================= */
  const [bus, setBus] = useState({
    bus_number: "",
    number_plate: "",
    direction: "UP",
  });
  const [buses, setBuses] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState("");

  /* ================= ROUTE ================= */
  const [routes, setRoutes] = useState([]);
  const [routeName, setRouteName] = useState("");
  const [routeId, setRouteId] = useState("");

  /* ================= STOPS ================= */
  const [stops, setStops] = useState([
    { stop_name: "", stop_order: 1, distance_km: 0 },
  ]);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    loadBuses();
    loadRoutes();
  }, []);

  const loadBuses = async () => {
    const res = await getAdminBuses();
    setBuses(res.data);
  };

  const loadRoutes = async () => {
    const res = await getAdminRoutes();
    setRoutes(res.data);
  };

  /* ================= HANDLERS ================= */

  const handleCreateBus = async () => {
    if (!bus.bus_number || !bus.number_plate) {
      alert("Bus number & number plate required");
      return;
    }

    await createBus(bus);
    alert("Bus created");

    setBus({ bus_number: "", number_plate: "", direction: "UP" });
    loadBuses();
  };

  const handleCreateRoute = async () => {
    if (!routeName) {
      alert("Route name required");
      return;
    }

    const res = await createRoute({ route_name: routeName });
    setRouteId(res.data.route_id);
    setRouteName("");

    // reset stops
    setStops([{ stop_name: "", stop_order: 1, distance_km: 0 }]);

    loadRoutes();
    alert("Route created");
  };

  const handleAssignRoute = async () => {
    if (!selectedBusId || !routeId) {
      alert("Select both bus and route");
      return;
    }

    await assignRouteToBus(selectedBusId, { route_id: routeId });
    alert("Route assigned to bus");

    loadBuses();
  };

  const handleAddStops = async () => {
    if (!routeId) {
      alert("Select a route first");
      return;
    }

    await addRouteStops(routeId, { stops });
    alert("Stops saved & current stop set");
  };

  const handleActivateBus = async (id) => {
    await activateBus(id);
    alert("Bus activated");
    loadBuses();
  };

  /* ================= UI ================= */

  return (
    <AdminLayout>
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <Topbar />

          <main className="p-6 space-y-8">
            <h1 className="text-xl font-semibold text-white">
              Manage Transport
            </h1>

            {/* STEP 1 — CREATE BUS */}
            <Card>
              <h3 className="font-semibold mb-4">Step 1 · Create Bus</h3>

              <div className="grid grid-cols-2 gap-4">
                <input
                  className="input"
                  placeholder="Bus Number"
                  value={bus.bus_number}
                  onChange={(e) =>
                    setBus({ ...bus, bus_number: e.target.value })
                  }
                />
                <input
                  className="input"
                  placeholder="Number Plate"
                  value={bus.number_plate}
                  onChange={(e) =>
                    setBus({ ...bus, number_plate: e.target.value })
                  }
                />
                <select
                  className="input col-span-2"
                  value={bus.direction}
                  onChange={(e) =>
                    setBus({ ...bus, direction: e.target.value })
                  }
                >
                  <option value="UP">UP</option>
                  <option value="DOWN">DOWN</option>
                </select>
              </div>

              <button onClick={handleCreateBus} className="btn-primary mt-4">
                Create Bus
              </button>
            </Card>

            {/* STEP 2 — SELECT BUS & ROUTE */}
            <Card>
              <h3 className="font-semibold mb-4">
                Step 2 · Assign Route to Bus
              </h3>

              <select
                className="input w-full mb-3"
                value={selectedBusId}
                onChange={(e) => setSelectedBusId(e.target.value)}
              >
                <option value="">Select Bus</option>
                {buses.map((b) => (
                  <option key={b.bus_id} value={b.bus_id}>
                    {b.bus_number}
                  </option>
                ))}
              </select>

              <select
                className="input w-full mb-3"
                value={routeId}
                onChange={(e) => setRouteId(e.target.value)}
              >
                <option value="">Select Existing Route</option>
                {routes.map((r) => (
                  <option key={r.route_id} value={r.route_id}>
                    {r.route_name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAssignRoute}
                disabled={!selectedBusId || !routeId}
                className="btn-primary disabled:opacity-50"
              >
                Assign Route
              </button>
            </Card>

            {/* STEP 3 — CREATE ROUTE (OPTIONAL) */}
            <Card>
              <h3 className="font-semibold mb-4">Create New Route</h3>

              <input
                className="input w-full"
                placeholder="Route name"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
              />

              <button onClick={handleCreateRoute} className="btn-primary mt-4">
                Create Route
              </button>
            </Card>

            {/* STEP 4 — ADD STOPS */}
            <Card>
              <h3 className="font-semibold mb-4">
                Step 3 · Add Stops & Distance
              </h3>

              {stops.map((s, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-3 mb-2">
                  <input
                    className="input"
                    placeholder="Stop name"
                    value={s.stop_name}
                    onChange={(e) => {
                      const copy = [...stops];
                      copy[idx].stop_name = e.target.value;
                      setStops(copy);
                    }}
                  />
                  <input className="input" value={s.stop_order} disabled />
                  <input
                    className="input"
                    type="number"
                    placeholder="KM"
                    value={s.distance_km}
                    onChange={(e) => {
                      const copy = [...stops];
                      copy[idx].distance_km = Number(e.target.value);
                      setStops(copy);
                    }}
                  />
                </div>
              ))}

              <div className="flex gap-3 mt-3">
                <button
                  className="btn-secondary"
                  onClick={() =>
                    setStops([
                      ...stops,
                      {
                        stop_name: "",
                        stop_order: stops.length + 1,
                        distance_km: 0,
                      },
                    ])
                  }
                >
                  + Add Stop
                </button>

                <button
                  onClick={handleAddStops}
                  disabled={!routeId}
                  className="btn-primary disabled:opacity-50"
                >
                  Save Stops
                </button>
              </div>
            </Card>

            {/* STEP 5 — ACTIVATE BUS */}
            <Card>
              <h3 className="font-semibold mb-4">Activate Bus</h3>

              {buses.map((b) => (
                <div
                  key={b.bus_id}
                  className="flex justify-between items-center py-2 border-b border-white/10"
                >
                  <span>
                    {b.bus_number}
                    <span className="text-slate-400 ml-2">
                      ({b.status})
                    </span>
                  </span>

                  {b.status !== "ACTIVE" && (
                    <button
                      onClick={() => handleActivateBus(b.bus_id)}
                      className="btn-success"
                    >
                      Activate
                    </button>
                  )}
                </div>
              ))}
            </Card>
          </main>
        </div>
      </div>
    </AdminLayout>
  );
}
