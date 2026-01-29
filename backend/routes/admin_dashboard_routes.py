from flask import Blueprint
from controllers.admin_dashboard_controller import (
    get_admin_dashboard_stats,
    get_admin_users,
    get_admin_journeys,
    get_admin_wallets,
    get_admin_transactions,
    get_admin_buses,
    get_bus_route_stops,
    get_admin_journey_chart,
    get_admin_revenue_chart,
    admin_global_search,
    create_route,
    create_bus,
    add_route_stops,
    activate_bus,
    assign_route_to_bus,
    get_admin_routes,
    get_routes_without_stops,
    deactivate_bus
)


admin_dashboard_routes = Blueprint("admin_dashboard_routes", __name__)

# Dashboard stats
admin_dashboard_routes.route(
    "/admin/dashboard/stats",
    methods=["GET"]
)(get_admin_dashboard_stats)

# Admin users
admin_dashboard_routes.route(
    "/admin/dashboard/users",
    methods=["GET"]
)(get_admin_users)


admin_dashboard_routes.route(
    "/admin/dashboard/journeys",
    methods=["GET"]
)(get_admin_journeys)



# Wallet summary
admin_dashboard_routes.route(
    "/admin/dashboard/wallets",
    methods=["GET"]
)(get_admin_wallets)

# Recent transactions
admin_dashboard_routes.route(
    "/admin/dashboard/transactions",
    methods=["GET"]
)(get_admin_transactions)


admin_dashboard_routes.route(
    "/admin/dashboard/buses",
    methods=["GET"]
)(get_admin_buses)

admin_dashboard_routes.route(
    "/admin/dashboard/buses/<int:bus_id>/stops",
    methods=["GET"]
)(get_bus_route_stops)

admin_dashboard_routes.route(
    "/admin/dashboard/charts/journeys",
    methods=["GET"]
)(get_admin_journey_chart)

admin_dashboard_routes.route(
    "/admin/dashboard/charts/revenue",
    methods=["GET"]
)(get_admin_revenue_chart)

admin_dashboard_routes.route(
    "/admin/dashboard/search",
    methods=["GET"]
)(admin_global_search)


admin_dashboard_routes.route(
    "/admin/routes",
    methods=["POST"]
)(create_route)

admin_dashboard_routes.route(
    "/admin/buses",
    methods=["POST"]
)(create_bus)

admin_dashboard_routes.route(
    "/admin/buses/<int:bus_id>/activate",
    methods=["POST"]
)(activate_bus)

admin_dashboard_routes.route(
    "/admin/routes",
    methods=["GET"]
)(get_admin_routes)

admin_dashboard_routes.route(
    "/admin/buses/<int:bus_id>/assign-route",
    methods=["POST", "OPTIONS"]
)(assign_route_to_bus)

admin_dashboard_routes.route(
    "/admin/routes/without-stops",
    methods=["GET"]
)(get_routes_without_stops)

admin_dashboard_routes.route(
    "/admin/routes/<int:route_id>/stops",
    methods=["POST", "OPTIONS"]
)(add_route_stops)

admin_dashboard_routes.route(
    "/admin/buses/<int:bus_id>/deactivate",
    methods=["POST"]
)(deactivate_bus)