import React, { useEffect, useState } from "react";
import "./AdminReservations.css";
import { apiGet, apiDelete, apiPut } from "../utils/api";

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("reservationTime");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReservations();
    // eslint-disable-next-line
  }, []);

  // Fetch all reservations
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await apiGet("/api/reservations/allReservations");
      setReservations(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update reservation status
  const updateStatus = async (resv) => {
    try {
      const updatedReservation = { ...resv, status: resv.status };
      await apiPut(`/api/reservations/${resv.id}`, updatedReservation);
      fetchReservations();
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete reservation
  const deleteReservation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reservation?")) return;
    try {
      await apiDelete(`/api/reservations/${id}`);
      fetchReservations();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle dropdown change
  const handleStatusChange = (resv, newStatus) => {
    const updatedResv = { ...resv, status: newStatus };
    updateStatus(updatedResv);
  };

  // Sort and filter reservations
  const getSortedAndFilteredReservations = () => {
    let filtered = reservations.filter(r => {
      const matchesSearch = searchTerm === "" || 
        r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.tableNumber.toString().includes(searchTerm);
      const matchesStatus = filterStatus === "ALL" || r.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      let compareValue = 0;
      
      if (sortBy === "reservationTime") {
        compareValue = new Date(a.reservationTime) - new Date(b.reservationTime);
      } else if (sortBy === "numberOfGuests") {
        compareValue = a.numberOfGuests - b.numberOfGuests;
      } else if (sortBy === "tableNumber") {
        compareValue = a.tableNumber - b.tableNumber;
      } else if (sortBy === "customerName") {
        compareValue = a.customerName.localeCompare(b.customerName);
      }
      
      return sortDirection === "asc" ? compareValue : -compareValue;
    });
  };

  const filteredReservations = getSortedAndFilteredReservations();

  return (
    <div className="admin-reservations-container">
      <h2>Manage Reservations</h2>
      
      <div className="controls-panel">
        <div className="search-box">
          <label>🔍 Search:</label>
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer or table..."
          />
        </div>
        <div className="control-group">
          <label>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="reservationTime">Date & Time</option>
            <option value="customerName">Customer Name</option>
            <option value="tableNumber">Table Number</option>
            <option value="numberOfGuests">Guests</option>
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
            <option value="Requested">Requested</option>
            <option value="Confirmed">Confirmed</option>
          </select>
        </div>
      </div>
      {loading ? (
        <div className="loading-state">Loading reservations...</div>
      ) : reservations.length === 0 ? (
        <div className="empty-state">No reservations found.</div>
      ) : filteredReservations.length === 0 ? (
        <div className="empty-state">No reservations match the selected filters.</div>
      ) : (
        <table className="reservations-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Table</th>
              <th>Time</th>
              <th>Guests</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((resv) => (
              <tr key={resv.id}>
                <td>{resv.id}</td>
                <td>{resv.customerName}</td>
                <td>{resv.tableNumber}</td>
                <td>{new Date(resv.reservationTime).toLocaleString()}</td>
                <td>{resv.numberOfGuests}</td>
                <td>
                  <span className={`status-badge ${resv.status.toLowerCase()}`}>
                    {resv.status}
                  </span>
                </td>
                <td>
                  <div className="reservation-actions">
                    <select
                      className="status-select"
                      value={resv.status}
                      onChange={(e) => handleStatusChange(resv, e.target.value)}
                    >
                      <option value="Requested">Requested</option>
                      <option value="Confirmed">Confirmed</option>
                    </select>
                    <button
                      className="btn-delete"
                      onClick={() => deleteReservation(resv.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminReservations;
