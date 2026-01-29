import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import Sidebar from "../layout/Sidebar";
import Topbar from "../layout/Topbar";
import Card from "../components/Card";
import Toast from "../components/Toast";

import {
  createRoute,
  addRouteStops,
  createBus,
  activateBus,
  deactivateBus,
  getAdminBuses,
  assignRouteToBus,
  getAdminRoutes,
  getRoutesWithoutStops,
} from "../api/adminDashboardApi";

export default function AdminManageTransport() {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [routesWithoutStops, setRoutesWithoutStops] = useState([]);

  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const [busForm, setBusForm] = useState({
    bus_number: "",
    number_plate: "",
    direction: "UP",
  });

  const [routeName, setRouteName] = useState("");

  const [stops, setStops] = useState([
    { stop_name: "", stop_order: 1, distance_km: 0 },
  ]);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: "", type });
    }, 3000);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const refreshAll = async () => {
    const [b, r, rs] = await Promise.all([
      getAdminBuses(),
      getAdminRoutes(),
      getRoutesWithoutStops(),
    ]);
    setBuses(b.data);
    setRoutes(r.data);
    setRoutesWithoutStops(rs.data);
  };

  /* ================= HANDLERS ================= */
  const handleCreateBus = async () => {
    if (!busForm.bus_number || !busForm.number_plate) {
      showToast("Bus number and number plate required", "error");
      return;
    }

    await createBus(busForm);
    setBusForm({ bus_number: "", number_plate: "", direction: "UP" });
    showToast("Bus created successfully");
    refreshAll();
  };
  const handleCreateRoute = async () => {
    if (!routeName) {
      showToast("Route name is required", "error");
      return;
    }

    await createRoute(routeName);
    setRouteName("");
    showToast("Route created successfully");
    refreshAll();
  };

  const handleAssignRoute = async () => {
    if (!selectedBus || !selectedRoute) {
      showToast("Select both bus and route", "error");
      return;
    }

    await assignRouteToBus(selectedBus.bus_id, selectedRoute.route_id);
    showToast("Route assigned to bus");
    setSelectedBus(null);
    setSelectedRoute(null);
    refreshAll();
  };

  const handleSaveStops = async () => {
    if (!selectedRoute) {
      showToast("Please select a route", "error");
      return;
    }

    await addRouteStops(selectedRoute.route_id, stops);
    showToast("Stops added successfully");
    setStops([{ stop_name: "", stop_order: 1, distance_km: 0 }]);
    setSelectedRoute(null);
    refreshAll();
  };
  const handleActivateBus = async (busId) => {
    await activateBus(busId);
    showToast("Bus activated");
    refreshAll();
  };
  const handleDeactivateBus = async (busId) => {
    await deactivateBus(busId);
    showToast("Bus deactivated");
    refreshAll();
  };

  /* ================= UI ================= */

  return (
    <AdminLayout>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: toast.type })}
      />
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Topbar />

          <main className="p-6 space-y-10 max-w-6xl mx-auto">
            <h1 className="text-2xl font-semibold text-white">
              Transport Administration
            </h1>
            {/* CREATE BUS */}
            <Card>
              <h2 className="text-xl font-semibold text-white mb-1">
                Create New Bus
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                Enter bus details clearly to add it to the system.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* BUS NUMBER */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Bus Number
                  </label>
                  <input
                    type="text"
                    placeholder="BUS 101"
                    value={busForm.bus_number}
                    onChange={(e) =>
                      setBusForm({ ...busForm, bus_number: e.target.value })
                    }
                    className="
          w-full rounded-lg
          border border-slate-600
          bg-slate-900
          px-4 py-3
          text-white
          placeholder-slate-500
          focus:border-blue-500
          focus:ring-2 focus:ring-blue-500
          outline-none
        "
                  />
                </div>

                {/* NUMBER PLATE */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Number Plate
                  </label>
                  <input
                    type="text"
                    placeholder="KL-15-A-4321"
                    value={busForm.number_plate}
                    onChange={(e) =>
                      setBusForm({ ...busForm, number_plate: e.target.value })
                    }
                    className="
          w-full rounded-lg
          border border-slate-600
          bg-slate-900
          px-4 py-3
          text-white
          placeholder-slate-500
          focus:border-blue-500
          focus:ring-2 focus:ring-blue-500
          outline-none
        "
                  />
                </div>

                {/* DIRECTION */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Direction
                  </label>
                  <select
                    value={busForm.direction}
                    onChange={(e) =>
                      setBusForm({ ...busForm, direction: e.target.value })
                    }
                    className="
          w-full rounded-lg
          border border-slate-600
          bg-slate-900
          px-4 py-3
          text-white
          focus:border-blue-500
          focus:ring-2 focus:ring-blue-500
          outline-none
          cursor-pointer
        "
                  >
                    <option value="UP">UP (Forward)</option>
                    <option value="DOWN">DOWN (Return)</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleCreateBus}
                  className="
        rounded-lg
        bg-[#7551ff]
        px-6 py-3
        text-white
        font-medium
        hover:bg-blue-700
        transition
      "
                >
                  Create Bus
                </button>
              </div>
            </Card>
            <Card>
              <h2 className="text-xl font-semibold text-white mb-1">
                Create New Route
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                Define a route before assigning stops and buses.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                {/* ROUTE NAME */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Route Name
                  </label>
                  <input
                    type="text"
                    placeholder="Kollam – Idukki"
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                    className="
          w-full rounded-lg
          border border-slate-600
          bg-slate-900
          px-4 py-3
          text-white
          placeholder-slate-500
          focus:border-blue-500
          focus:ring-2 focus:ring-blue-500
          outline-none
        "
                  />
                </div>

                {/* ACTION */}
                <div className="flex justify-end">
                  <button
                    onClick={handleCreateRoute}
                    className="
          rounded-lg
          bg-[#7551ff]
          px-6 py-3
          text-white
          font-medium
          hover:bg-blue-700
          transition
        "
                  >
                    Create Route
                  </button>
                </div>
              </div>
            </Card>
            {/* ASSIGN ROUTE */}
            <Card>
              <h2 className="text-xl font-semibold text-white mb-1">
                Assign Route to Bus
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                Step 1: Select a bus · Step 2: Select a route · Step 3: Assign
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* ================= BUS LIST ================= */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-3">
                    Select Bus
                  </h4>

                  <div className="space-y-3">
                    {buses.map((b) => (
                      <div
                        key={b.bus_id}
                        onClick={() => setSelectedBus(b)}
                        className={`
              cursor-pointer rounded-lg border px-4 py-3 transition
              ${
                selectedBus?.bus_id === b.bus_id
                  ? "border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/40"
                  : "border-white/10 hover:border-blue-400/40 hover:bg-white/5"
              }
            `}
                      >
                        <div className="text-white font-medium">
                          {b.bus_number}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          Status: {b.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ================= ROUTE LIST ================= */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-3">
                    Select Route
                  </h4>

                  <div className="space-y-3">
                    {routes.map((r) => (
                      <div
                        key={r.route_id}
                        onClick={() => setSelectedRoute(r)}
                        className={`
              cursor-pointer rounded-lg border px-4 py-3 transition
              ${
                selectedRoute?.route_id === r.route_id
                  ? "border-green-500 bg-green-500/10 ring-2 ring-green-500/40"
                  : "border-white/10 hover:border-green-400/40 hover:bg-white/5"
              }
            `}
                      >
                        <div className="text-white font-medium">
                          {r.route_name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ================= ACTION ================= */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleAssignRoute}
                  disabled={!selectedBus || !selectedRoute}
                  className={`
        rounded-lg px-6 py-3 font-medium transition
        ${
          selectedBus && selectedRoute
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-slate-700 text-slate-400 cursor-not-allowed"
        }
      `}
                >
                  Assign Route
                </button>
              </div>
            </Card>{" "}
            {/* ADD STOPS */}
            <Card>
              <h2 className="text-xl font-semibold text-white mb-1">
                Add Stops to Route
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                Add stops in order. Distance is measured from the previous stop.
              </p>

              {/* ROUTE CONTEXT */}
              {selectedRoute && (
                <div className="mb-6 rounded-lg border border-yellow-400/40 bg-yellow-400/10 px-4 py-3">
                  <span className="text-sm text-yellow-300 font-medium">
                    Selected Route:
                  </span>
                  <span className="ml-2 text-white font-semibold">
                    {selectedRoute.route_name}
                  </span>
                </div>
              )}

              {/* STOPS LIST */}
              <div className="space-y-4">
                {stops.map((s, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end
                   rounded-lg border border-white/10 p-4"
                  >
                    {/* STOP ORDER */}
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">
                        Stop Order
                      </label>
                      <input
                        value={s.stop_order}
                        disabled
                        className="
              w-full rounded-lg bg-slate-800
              px-4 py-3 text-white text-center
              border border-slate-700
            "
                      />
                    </div>

                    {/* STOP NAME */}
                    <div className="md:col-span-2">
                      <label className="block text-sm text-slate-400 mb-2">
                        Stop Name
                      </label>
                      <input
                        type="text"
                        placeholder="Eg: Kottayam"
                        value={s.stop_name}
                        onChange={(e) => {
                          const copy = [...stops];
                          copy[index].stop_name = e.target.value;
                          setStops(copy);
                        }}
                        className="
              w-full rounded-lg
              border border-slate-600
              bg-slate-900
              px-4 py-3 text-white
              placeholder-slate-500
              focus:border-blue-500
              focus:ring-2 focus:ring-blue-500
              outline-none
            "
                      />
                    </div>

                    {/* DISTANCE */}
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">
                        Distance (KM)
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={s.distance_km}
                        onChange={(e) => {
                          const copy = [...stops];
                          copy[index].distance_km = Number(e.target.value);
                          setStops(copy);
                        }}
                        className="
              w-full rounded-lg
              border border-slate-600
              bg-slate-900
              px-4 py-3 text-white
              placeholder-slate-500
              focus:border-blue-500
              focus:ring-2 focus:ring-blue-500
              outline-none
            "
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* ACTIONS */}
              <div className="mt-6 flex justify-between items-center">
                <button
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
                  className="
        rounded-lg border border-blue-500/40
        bg-blue-500/10 px-5 py-2
        text-blue-400 hover:bg-blue-500 hover:text-white
        transition
      "
                >
                  + Add Another Stop
                </button>

                <button
                  onClick={handleSaveStops}
                  disabled={!selectedRoute}
                  className="
        rounded-lg bg-green-600
        px-6 py-3 text-white font-medium
        hover:bg-green-700
        disabled:opacity-50
        transition
      "
                >
                  Save Stops
                </button>
              </div>
            </Card>
            {/* BUS STATUS */}
            <Card>
              <h2 className="text-xl font-semibold text-white mb-1">
                Bus Status Management
              </h2>
              <p className="text-sm text-slate-400 mb-4">
                Activate or deactivate buses for operations or maintenance.
              </p>

              <div className="divide-y divide-white/10">
                {buses.map((b) => (
                  <div
                    key={b.bus_id}
                    className="flex items-center justify-between py-4 hover:bg-white/5 rounded-lg px-2 transition"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`h-3 w-3 rounded-full ${
                          b.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <div>
                        <div className="text-white font-medium text-lg">
                          {b.bus_number}
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            b.status === "ACTIVE"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>
                    </div>

                    {b.status === "ACTIVE" ? (
                      <button
                        onClick={() => handleDeactivateBus(b.bus_id)}
                        className="rounded-lg border border-red-500/50 bg-red-500/10 px-5 py-2 text-red-400 hover:bg-red-500 hover:text-white transition"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivateBus(b.bus_id)}
                        className="rounded-lg border border-green-500/50 bg-green-500/10 px-5 py-2 text-green-400 hover:bg-green-500 hover:text-white transition"
                      >
                        Activate
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </main>
        </div>
      </div>
    </AdminLayout>
  );
}
