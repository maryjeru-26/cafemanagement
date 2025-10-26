import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "./AdminMenu";
import AdminOrders from "./AdminOrders";
import AdminReservations from "./AdminReservations";
import InventoryList from "./InventoryList";
import SupplierList from "./SupplierList";
import { apiGet } from "../utils/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const [activeView, setActiveView] = useState("analytics");
  
  // State for analytics data
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    revenue: { value: "₹0", change: "+0%", positive: true },
    orders: { value: "0", change: "+0%", positive: true },
    customers: { value: "0", change: "+0%", positive: true },
    reservations: { value: "0", change: "+0%", positive: false },
  });
  const [popularItems, setPopularItems] = useState([]);
  const [popularItemsFull, setPopularItemsFull] = useState([]);
  const [popularLimit, setPopularLimit] = useState(5); // allow configuring how many popular items to show

  useEffect(() => {
    if (activeView === "analytics") {
      fetchAnalyticsData();
    }
  }, [activeView]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Fetch all orders
      const orders = await apiGet("/api/orders/allOrders");

      // Fetch all reservations
      const reservations = await apiGet("/api/reservations/allReservations");

      // Fetch all users
      const users = await apiGet("/api/users/allUsers");

      // Calculate total revenue
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      // Calculate popular items based on order items
      const itemSalesMap = {};
      orders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach(item => {
            const itemName = item.itemName || item.name;
            if (itemName) {
              itemSalesMap[itemName] = (itemSalesMap[itemName] || 0) + 1;
            }
          });
        }
      });

      // Convert to array and sort (keep full array; UI will pick top-N or all)
      const popularItemsArray = Object.entries(itemSalesMap)
        .map(([name, sales]) => ({ name, sales }))
        .sort((a, b) => b.sales - a.sales);

      // Save full sorted list; UI decides how many to display
      setPopularItemsFull(popularItemsArray);

      // By default show the configured top-N (popularLimit)
      const toDisplay = popularLimit === 'ALL' ? popularItemsArray : popularItemsArray.slice(0, Number(popularLimit));

      // Calculate percentages for chart based on displayed items
      const maxSales = toDisplay[0]?.sales || 1;
      const itemsWithPercentage = toDisplay.map(item => ({
        ...item,
        percentage: Math.round((item.sales / maxSales) * 100),
      }));

      // Filter active customers (users with at least one order)
      const activeCustomers = users.filter(user => 
        user.role !== "ADMIN" && orders.some(order => order.userId === user.id || order.user?.id === user.id)
      );

      // Update analytics data
      setAnalyticsData({
        revenue: { 
          value: `₹${totalRevenue.toLocaleString()}`, 
          change: "+12.5%", 
          positive: true 
        },
        orders: { 
          value: orders.length.toString(), 
          change: "+8.2%", 
          positive: true 
        },
        customers: { 
          value: activeCustomers.length.toString(), 
          change: "+15.3%", 
          positive: true 
        },
        reservations: { 
          value: reservations.length.toString(), 
          change: reservations.length > 40 ? "+5.1%" : "-2.1%", 
          positive: reservations.length > 40 
        },
      });

  setPopularItems(itemsWithPercentage);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      alert("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Recompute displayed popular items when full list or limit changes
  useEffect(() => {
    if (!popularItemsFull || popularItemsFull.length === 0) return;
    const toDisplay = popularLimit === 'ALL' ? popularItemsFull : popularItemsFull.slice(0, Number(popularLimit));
    const maxSales = toDisplay[0]?.sales || 1;
    const itemsWithPercentage = toDisplay.map(item => ({
      ...item,
      percentage: Math.round((item.sales / maxSales) * 100),
    }));
    setPopularItems(itemsWithPercentage);
  }, [popularLimit, popularItemsFull]);

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
          <div className="admin-badge">ADMIN</div>
          <p style={{ fontSize: '0.85rem', marginTop: '10px' }}>{email}</p>
        </div>

        <nav className="admin-sidebar-nav">
          <div
            className={`admin-nav-item ${activeView === "analytics" ? "active" : ""}`}
            onClick={() => setActiveView("analytics")}
          >
            <span className="admin-nav-icon">📊</span>
            <span>Analytics</span>
          </div>

          <div
            className={`admin-nav-item ${activeView === "menu" ? "active" : ""}`}
            onClick={() => setActiveView("menu")}
          >
            <span className="admin-nav-icon">🍽️</span>
            <span>Menu Management</span>
          </div>

          <div
            className={`admin-nav-item ${activeView === "orders" ? "active" : ""}`}
            onClick={() => setActiveView("orders")}
          >
            <span className="admin-nav-icon">📦</span>
            <span>Orders</span>
          </div>

          <div
            className={`admin-nav-item ${activeView === "reservations" ? "active" : ""}`}
            onClick={() => setActiveView("reservations")}
          >
            <span className="admin-nav-icon">📅</span>
            <span>Reservations</span>
          </div>

          <div
            className={`admin-nav-item ${activeView === "inventory" ? "active" : ""}`}
            onClick={() => setActiveView("inventory")}
          >
            <span className="admin-nav-icon">📋</span>
            <span>Inventory</span>
          </div>

          <div
            className={`admin-nav-item ${activeView === "suppliers" ? "active" : ""}`}
            onClick={() => setActiveView("suppliers")}
          >
            <span className="admin-nav-icon">🚚</span>
            <span>Suppliers</span>
          </div>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
             Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main-content">
        <div className="admin-content-header">
          <h1>Welcome, Admin!</h1>
          <p>Manage your café operations efficiently</p>
        </div>

        {/* Analytics View */}
        {activeView === "analytics" && (
          <div className="analytics-section">
            <h2>Dashboard Analytics</h2>
            
            {loading ? (
              <div className="loading-analytics">
                <p>Loading analytics data...</p>
              </div>
            ) : (
              <>
            <div className="analytics-grid">
              <div className="analytics-card revenue">
                <div className="analytics-card-header">
                  <div className="analytics-icon">💰</div>
                  <div>
                    <div className="analytics-card-title">Total Revenue</div>
                  </div>
                </div>
                <div className="analytics-value">{analyticsData.revenue.value}</div>
                <div className={`analytics-change ${analyticsData.revenue.positive ? 'positive' : 'negative'}`}>
                  {analyticsData.revenue.positive ? '↗' : '↘'} {analyticsData.revenue.change} vs last month
                </div>
              </div>

              <div className="analytics-card orders">
                <div className="analytics-card-header">
                  <div className="analytics-icon">📦</div>
                  <div>
                    <div className="analytics-card-title">Total Orders</div>
                  </div>
                </div>
                <div className="analytics-value">{analyticsData.orders.value}</div>
                <div className={`analytics-change ${analyticsData.orders.positive ? 'positive' : 'negative'}`}>
                  {analyticsData.orders.positive ? '↗' : '↘'} {analyticsData.orders.change} vs last month
                </div>
              </div>

              <div className="analytics-card customers">
                <div className="analytics-card-header">
                  <div className="analytics-icon">👥</div>
                  <div>
                    <div className="analytics-card-title">Active Customers</div>
                  </div>
                </div>
                <div className="analytics-value">{analyticsData.customers.value}</div>
                <div className={`analytics-change ${analyticsData.customers.positive ? 'positive' : 'negative'}`}>
                  {analyticsData.customers.positive ? '↗' : '↘'} {analyticsData.customers.change} vs last month
                </div>
              </div>

              <div className="analytics-card reservations">
                <div className="analytics-card-header">
                  <div className="analytics-icon">📅</div>
                  <div>
                    <div className="analytics-card-title">Reservations</div>
                  </div>
                </div>
                <div className="analytics-value">{analyticsData.reservations.value}</div>
                <div className={`analytics-change ${analyticsData.reservations.positive ? 'positive' : 'negative'}`}>
                  {analyticsData.reservations.positive ? '↗' : '↘'} {analyticsData.reservations.change} vs last month
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="chart-container">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h3 style={{ margin: 0 }}>Popular Menu Items - Sales Performance</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label style={{ fontSize: '0.9rem', color: '#555' }}>Show:</label>
                        <select value={popularLimit} onChange={(e) => {
                          const v = e.target.value;
                          setPopularLimit(v === 'ALL' ? 'ALL' : Number(v));
                        }} style={{ padding: '6px 10px', borderRadius: 6 }}>
                          <option value={5}>Top 5</option>
                          <option value={10}>Top 10</option>
                          <option value={20}>Top 20</option>
                          <option value={'ALL'}>All</option>
                        </select>
                      </div>
                    </div>
              {popularItems.length === 0 ? (
                <div className="no-chart-data">
                  <p>📊 No sales data available yet</p>
                  <p style={{ fontSize: '0.9rem', color: '#7f8c8d', marginTop: '10px' }}>
                    Popular items will appear here once orders are placed
                  </p>
                </div>
              ) : (
                <div className="sales-chart">
                  {popularItems.map((item, index) => (
                    <div
                      key={index}
                      className="chart-bar"
                      style={{ '--bar-height': `${item.percentage}%` }}
                      title={`${item.name}: ${item.sales} orders`}
                    >
                      <div className="chart-bar-value">{item.sales}</div>
                      <div className="chart-bar-label">{item.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="admin-section">
              <h2>Quick Actions</h2>
              <div className="quick-actions">
                <button className="action-btn" onClick={() => setActiveView("menu")}>
                  ➕ Add New Menu Item
                </button>
                <button className="action-btn" onClick={() => setActiveView("orders")}>
                  📋 View All Orders
                </button>
                <button className="action-btn" onClick={() => setActiveView("inventory")}>
                  📦 Check Inventory
                </button>
                <button className="action-btn" onClick={() => setActiveView("reservations")}>
                  📅 Manage Reservations
                </button>
              </div>
            </div>
            </>
            )}
          </div>
        )}

        {/* Menu Management View */}
        {activeView === "menu" && (
          <div className="admin-section">
            <h2>Menu Management</h2>
            <AdminMenu />
          </div>
        )}

        {/* Orders View */}
        {activeView === "orders" && (
          <div className="admin-section">
            <h2>Order Management</h2>
            <AdminOrders />
          </div>
        )}

        {/* Reservations View */}
        {activeView === "reservations" && (
          <div className="admin-section">
            <h2>Reservation Management</h2>
            <AdminReservations />
          </div>
        )}

        {/* Inventory View */}
        {activeView === "inventory" && (
          <div className="admin-section">
            <h2>Inventory Management</h2>
            <InventoryList />
          </div>
        )}

        {/* Suppliers View */}
        {activeView === "suppliers" && (
          <div className="admin-section">
            <h2>Supplier Management</h2>
            <SupplierList />
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
