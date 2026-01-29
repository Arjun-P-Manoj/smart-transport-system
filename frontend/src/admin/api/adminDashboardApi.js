import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5050",
});

/* ================= DASHBOARD ================= */

export const getAdminDashboardStats = () => api.get("/admin/dashboard/stats");

export const getAdminWallets = () => api.get("/admin/dashboard/wallets");

export const getAdminJourneys = (filters = {}) =>
  api.get("/admin/dashboard/journeys", { params: filters });

export const getAdminTransactions = (filters = {}) =>
  api.get("/admin/dashboard/transactions", { params: filters });

export const getAdminUsers = (filters = {}) =>
  api.get("/admin/dashboard/users", { params: filters });

export const adminGlobalSearch = (query) =>
  api.get("/admin/dashboard/search", { params: { q: query } });

export const getUsersWithDue = () =>
  api.get("/admin/dashboard/users", {
    params: { due: "yes" },
  });
export const deactivateBus = (busId) =>
  api.post(`/admin/buses/${busId}/deactivate`);

/* ================= CHARTS ================= */

export const getAdminJourneyChart = () =>
  api.get("/admin/dashboard/charts/journeys");

export const getAdminRevenueChart = () =>
  api.get("/admin/dashboard/charts/revenue");

/* ================= BUSES ================= */

export const getAdminBuses = (filters = {}) =>
  api.get("/admin/dashboard/buses", { params: filters });

export const getBusRouteStops = (busId) =>
  api.get(`/admin/dashboard/buses/${busId}/stops`);

export const createBus = (busData) => api.post("/admin/buses", busData);

export const activateBus = (busId) =>
  api.post(`/admin/buses/${busId}/activate`);

export const assignRouteToBus = (busId, routeId) =>
  api.post(`/admin/buses/${busId}/assign-route`, {
    route_id: routeId,
  });

/* ================= ROUTES ================= */

export const createRoute = (routeName) =>
  api.post("/admin/routes", {
    route_name: routeName,
  });

export const getAdminRoutes = () => api.get("/admin/routes");

/**
 * ✅ NEW
 * Only routes that DO NOT have stops yet
 */
export const getRoutesWithoutStops = () =>
  api.get("/admin/routes/without-stops");

export const addRouteStops = (routeId, stops) =>
  api.post(`/admin/routes/${routeId}/stops`, {
    stops,
  });
