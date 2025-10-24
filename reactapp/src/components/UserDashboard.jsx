import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserMenu from "./UserMenu";
import CartPage from "./CartPage";
import { CartContext } from "./CartContext";
import Reservation from "./Reservation";
import NotificationsManager from "./NotificationsManager";
import "./UserDashboard.css";
import { apiGet } from "../utils/api";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [activeView, setActiveView] = useState("menu"); // menu, cart, orders, reservations
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderSortBy, setOrderSortBy] = useState("orderDate");
  const [orderSortDirection, setOrderSortDirection] = useState("desc");
  const [orderSearchTerm, setOrderSearchTerm] = useState("");

  const userId = localStorage.getItem("userId");

  // Load user info
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");

    if (!storedEmail) navigate("/"); // redirect to login if not logged in
    else {
      setUsername(storedUsername || storedEmail);
      setEmail(storedEmail);
    }
  }, [navigate]);

  // Fetch orders when orders view is active
  useEffect(() => {
    if (activeView === "orders") fetchOrders();
    // eslint-disable-next-line
  }, [activeView]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await apiGet(`/api/orders/user/${userId}`);
      setOrders(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const orderStatusStyle = (status) => {
    switch (status) {
      case "PLACED":
        return { backgroundColor: "#ffeb3b", color: "#000" };
      case "PROCESSING":
        return { backgroundColor: "#03a9f4", color: "#fff" };
      case "DELIVERED":
        return { backgroundColor: "#4caf50", color: "#fff" };
      case "CANCELLED":
        return { backgroundColor: "#f44336", color: "#fff" };
      default:
        return { backgroundColor: "#ccc", color: "#000" };
    }
  };

  const sortAndFilterOrders = (ordersToSort) => {
    // Filter orders based on search term
    const filtered = ordersToSort.filter(order => {
      const searchLower = orderSearchTerm.toLowerCase();
      return orderSearchTerm === "" ||
        order.id.toString().includes(searchLower) ||
        order.totalAmount.toString().includes(searchLower) ||
        order.orderStatus.toLowerCase().includes(searchLower) ||
        order.items?.some(item => 
          item.itemName?.toLowerCase().includes(searchLower) ||
          item.category?.toLowerCase().includes(searchLower)
        );
    });

    // Sort filtered results
    return [...filtered].sort((a, b) => {
      let compareValue = 0;
      
      if (orderSortBy === "totalAmount") {
        compareValue = a.totalAmount - b.totalAmount;
      } else if (orderSortBy === "orderDate") {
        compareValue = new Date(a.orderDate) - new Date(b.orderDate);
      } else if (orderSortBy === "category") {
        // Sort by category of first item
        const catA = a.items?.[0]?.category || "";
        const catB = b.items?.[0]?.category || "";
        compareValue = catA.localeCompare(catB);
      }
      
      return orderSortDirection === "asc" ? compareValue : -compareValue;
    });
  };

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="user-dashboard">
      {/* Notifications */}
      <NotificationsManager />

      {/* Sidebar */}
      <aside className="user-sidebar">
        <div className="user-sidebar-header">
          <h2>☕ Café Amore</h2>
          <p>{username}</p>
          <p style={{ fontSize: '0.8rem', marginTop: '5px' }}>{email}</p>
        </div>

        <nav className="user-sidebar-nav">
          <div
            className={`user-nav-item ${activeView === "menu" ? "active" : ""}`}
            onClick={() => setActiveView("menu")}
          >
            <span className="nav-icon">🍽️</span>
            <span>Menu</span>
          </div>

          <div
            className={`user-nav-item ${activeView === "cart" ? "active" : ""}`}
            onClick={() => setActiveView("cart")}
          >
            <span className="nav-icon">🛒</span>
            <span>Cart</span>
            {cartItemsCount > 0 && <span className="badge">{cartItemsCount}</span>}
          </div>

          <div
            className={`user-nav-item ${activeView === "orders" ? "active" : ""}`}
            onClick={() => setActiveView("orders")}
          >
            <span className="nav-icon">📦</span>
            <span>My Orders</span>
          </div>

          <div
            className={`user-nav-item ${activeView === "reservations" ? "active" : ""}`}
            onClick={() => setActiveView("reservations")}
          >
            <span className="nav-icon">📅</span>
            <span>Reservations</span>
          </div>
        </nav>

        <div className="user-sidebar-footer">
          <button className="user-logout-btn" onClick={handleLogout}>
             Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="user-main-content">
        <div className="user-content-header">
          <h1>Welcome, {username}!</h1>
          <p>What would you like to do today?</p>
        </div>

        <div className="user-view-container">
          {activeView === "menu" && <UserMenu />}

          {activeView === "cart" && <CartPage />}

          {activeView === "orders" && (
            <div className="orders-section">
              <h2>My Orders</h2>
              
              {!loading && orders.length > 0 && (
                <div className="order-controls">
                  <div className="search-controls">
                    <label>🔍 Search:</label>
                    <input 
                      type="text"
                      value={orderSearchTerm}
                      onChange={(e) => setOrderSearchTerm(e.target.value)}
                      placeholder="Search by Order ID, Amount, Status, or Item..."
                    />
                  </div>
                  <div className="sort-controls">
                    <label>Sort by:</label>
                    <select value={orderSortBy} onChange={(e) => setOrderSortBy(e.target.value)}>
                      <option value="orderDate">Date</option>
                      <option value="totalAmount">Price</option>
                      <option value="category">Category</option>
                    </select>
                    <select value={orderSortDirection} onChange={(e) => setOrderSortDirection(e.target.value)}>
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="loading-state">Loading your orders...</div>
              ) : orders.length === 0 ? (
                <div className="empty-state">You haven't placed any orders yet.</div>
              ) : sortAndFilterOrders(orders).length === 0 ? (
                <div className="empty-state">No orders match your search.</div>
              ) : (
                <div className="orders-container">
                  {sortAndFilterOrders(orders).map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <h4>Order #{order.id}</h4>
                        <span className="order-status-badge" style={orderStatusStyle(order.orderStatus)}>
                          {order.orderStatus}
                        </span>
                      </div>
                      <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                      <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
                      <p><strong>Quantity:</strong> {order.quantity}</p>
                      <p><strong>Items:</strong></p>
                      <ul>
                        {order.items?.map((item, idx) => (
                          <li key={idx}>
                            {item.itemName} - ₹{item.price} ({item.category})
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeView === "reservations" && <Reservation username={username} />}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
