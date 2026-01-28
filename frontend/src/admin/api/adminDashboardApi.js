import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5050",
});

export const getAdminDashboardStats = () => {
  return api.get("/admin/dashboard/stats");
};

export const getAdminWallets = () => api.get("/admin/dashboard/wallets");

export const getAdminJourneys = (filters = {}) => {
  return api.get("/admin/dashboard/journeys", { params: filters });
};

export const getAdminBuses = (filters = {}) =>
  api.get("/admin/dashboard/buses", { params: filters });

export const getAdminTransactions = (filters = {}) =>
  api.get("/admin/dashboard/transactions", { params: filters });

export const getBusRouteStops = (busId) =>
  api.get(`/admin/dashboard/buses/${busId}/stops`);

export const getAdminUsers = (filters) =>
  api.get("/admin/dashboard/users", { params: filters });

/* ================= CHARTS ================= */
export const getAdminJourneyChart = () =>
  api.get("/admin/dashboard/charts/journeys");

export const getAdminRevenueChart = () =>
  api.get("/admin/dashboard/charts/revenue");

export const getUsersWithDue = () =>
  api.get("/admin/dashboard/users", {
    params: { due: "yes" },
  });

export const adminGlobalSearch = (query) => {
  return api.get("/admin/dashboard/search", {
    params: { q: query },
  });
};

/* ================= ROUTES & BUSES (ADMIN CRUD) ================= */

// ➕ Create Route
export const createRoute = (routeName) =>
  api.post("/admin/routes", {
    route_name: routeName,
  });

// ➕ Add Stops to Route
export const addRouteStops = (routeId, stops) =>
  api.post(`/admin/routes/${routeId}/stops`, {
    stops,
  });

// ➕ Create Bus
export const createBus = (busData) => api.post("/admin/buses", busData);

// ▶ Activate Bus
export const activateBus = (busId) =>
  api.post(`/admin/buses/${busId}/activate`);

export const assignRouteToBus = (busId, data) =>
  api.post(`/admin/buses/${busId}/assign-route`, data);

export const getAdminRoutes = () => api.get("/admin/routes");
