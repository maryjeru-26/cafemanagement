import React, { useEffect, useState } from "react";
import "./AdminOrders.css";
import { apiGet, apiDelete, apiPut } from "../utils/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [sortBy, setSortBy] = useState("orderDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await apiGet("/api/orders/allOrders");
      setOrders(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await apiDelete(`/api/orders/${id}`);
      setOrders(orders.filter((o) => o.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const order = orders.find((o) => o.id === id);
      const updatedOrder = { ...order, orderStatus: newStatus };

      await apiPut(`/api/orders/${id}`, updatedOrder);

      setOrders(
        orders.map((o) =>
          o.id === id ? { ...o, orderStatus: newStatus } : o
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // Sort and filter orders
  const getSortedAndFilteredOrders = () => {
    let filtered = orders.filter(o => {
      const matchesSearch = searchTerm === "" || 
        o.id.toString().includes(searchTerm) ||
        (o.user?.id || o.userId || "").toString().includes(searchTerm) ||
        o.totalAmount.toString().includes(searchTerm);
      const matchesStatus = filterStatus === "ALL" || o.orderStatus === filterStatus;
      return matchesSearch && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      let compareValue = 0;
      
      if (sortBy === "orderDate") {
        compareValue = new Date(a.orderDate) - new Date(b.orderDate);
      } else if (sortBy === "totalAmount") {
        compareValue = a.totalAmount - b.totalAmount;
      } else if (sortBy === "quantity") {
        compareValue = a.quantity - b.quantity;
      }
      
      return sortDirection === "asc" ? compareValue : -compareValue;
    });
  };

  if (loading) return <div className="loading-state">Loading orders...</div>;

  const filteredOrders = getSortedAndFilteredOrders();

  return (
    <div className="admin-orders-container">
      <h2>All Orders</h2>

      <div className="controls-panel">
        <div className="search-box">
          <label>🔍 Search:</label>
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID, User ID or Amount..."
          />
        </div>
        <div className="control-group">
          <label>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="orderDate">Order Date</option>
            <option value="totalAmount">Total Amount</option>
            <option value="quantity">Quantity</option>
          </select>
          <select 
            value={sortDirection} 
            onChange={(e) => setSortDirection(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <div className="control-group">
          <label>Filter by Status:</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="PLACED">Placed</option>
            <option value="PROCESSING">Processing</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">No orders found.</div>
      ) : filteredOrders.length === 0 ? (
        <div className="empty-state">No orders match the selected filters.</div>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <React.Fragment key={order.id}>
              <tr>
                <td>{order.id}</td>
                <td>{order.user?.id || order.userId}</td>
                <td>
                  {new Date(order.orderDate).toLocaleString()}
                </td>
                <td>₹{order.totalAmount}</td>
                <td>
                  <span className={`status-badge ${order.orderStatus.toLowerCase()}`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td>
                  <div className="order-actions">
                    <select
                      className="status-select"
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                    >
                      <option value="PLACED">PLACED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(order.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn-view-items"
                      onClick={() => setExpandedOrders(prev => ({ ...prev, [order.id]: !prev[order.id] }))}
                    >
                      {expandedOrders[order.id] ? 'Hide Items' : 'View Items'}
                    </button>
                  </div>
                </td>
              </tr>
              {/* expanded items row */}
              {expandedOrders[order.id] && (
                <tr className="order-items-row" key={`${order.id}-items`}>
                  <td colSpan={6}>
                    {order.items && order.items.length > 0 ? (
                      <table className="items-table">
                        <thead>
                          <tr>
                            <th>Item ID</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Available</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((it) => ( 
                            <tr key={it.id}>
                              <td>{it.id}</td>
                              <td>{it.itemName}</td>
                              <td>{it.category}</td>
                              <td>₹{it.price}</td>
                              <td>{it.available ? 'Yes' : 'No'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="empty-items">No items for this order.</div>
                    )}
                  </td>
                </tr>
              )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrders;
