import React, { useEffect, useState } from "react";
import "./Reservation.css";
import { apiGet, apiPost } from "../utils/api";

const Reservation = ({ username }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("reservationTime");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const [reservationData, setReservationData] = useState({
    customerName: username || "",
    tableNumber: 1,
    reservationTime: "",
    numberOfGuests: 1,
  });
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    fetchReservations();
    // eslint-disable-next-line
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await apiGet("/api/reservations/allReservations");
      setReservations(data.filter(r => r.customerName === username));
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservationData(prev => ({ ...prev, [name]: value }));
    if (name === 'reservationTime') validateReservationTime(value);
  };

  const submitReservation = async () => {
    if (!reservationData.reservationTime || !reservationData.customerName) {
      return alert("Please fill all fields");
    }

    if (!validateReservationTime(reservationData.reservationTime)) return;

    try {
      const created = await apiPost("/api/reservations/addReservation", { 
        ...reservationData, 
        status: "BOOKED" 
      });

      alert("Reservation created successfully!");
      // reset form
      setReservationData({
        customerName: username,
        tableNumber: 1,
        reservationTime: "",
        numberOfGuests: 1,
      });

      if (created && created.id) {
        // Prepend the created reservation so it's immediately visible
        setReservations(prev => [created, ...prev]);
      } else {
        // Fallback: re-fetch the list from backend
        fetchReservations();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const validateReservationTime = (isoString) => {
    setDateError("");
    if (!isoString) return true;
    const selected = new Date(isoString);
    if (isNaN(selected.getTime())) {
      setDateError('Invalid date/time');
      return false;
    }
    const now = new Date();
    // allow a tiny grace window of 5 minutes
    if (selected.getTime() < now.getTime() - 5 * 60 * 1000) {
      setDateError('Reservation date/time cannot be in the past');
      return false;
    }
    const maxDays = 60;
    const maxDate = new Date(now.getTime() + maxDays * 24 * 60 * 60 * 1000);
    if (selected.getTime() > maxDate.getTime()) {
      setDateError(`Reservations can only be made up to ${maxDays} days in advance`);
      return false;
    }
    setDateError("");
    return true;
  };

  // Sort and filter reservations
  const getSortedAndFilteredReservations = () => {
    // Filter by search term
    let filtered = reservations.filter(r => {
      const matchesSearch = searchTerm === "" ||
        r.id.toString().includes(searchTerm) ||
        r.tableNumber.toString().includes(searchTerm) ||
        r.numberOfGuests.toString().includes(searchTerm) ||
        r.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(r.reservationTime).toLocaleString().toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    // Filter by status
    filtered = filterStatus === "ALL" 
      ? filtered 
      : filtered.filter(r => r.status === filterStatus);

    // Sort
    return [...filtered].sort((a, b) => {
      let compareValue = 0;
      
      if (sortBy === "reservationTime") {
        compareValue = new Date(a.reservationTime) - new Date(b.reservationTime);
      } else if (sortBy === "numberOfGuests") {
        compareValue = a.numberOfGuests - b.numberOfGuests;
      } else if (sortBy === "tableNumber") {
        compareValue = a.tableNumber - b.tableNumber;
      }
      
      return sortDirection === "asc" ? compareValue : -compareValue;
    });
  };

  return (
    <div className="reservation-container">
      <h2>My Reservations</h2>

      <div className="reservation-form">
        <h3>Reserve a Table</h3>
        <div className="reservation-form-grid">
          <input
            type="text"
            name="customerName"
            placeholder="Your Name"
            value={reservationData.customerName}
            onChange={handleChange}
          />
          <input
            type="number"
            name="tableNumber"
            placeholder="Table Number"
            value={reservationData.tableNumber}
            onChange={handleChange}
            min={1}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <input
              type="datetime-local"
              name="reservationTime"
              value={reservationData.reservationTime}
              onChange={handleChange}
            />
            {dateError && <div className="reservation-error">{dateError}</div>}
          </div>
          <input
            type="number"
            name="numberOfGuests"
            placeholder="Number of Guests"
            value={reservationData.numberOfGuests}
            onChange={handleChange}
            min={1}
          />
        </div>
        <button onClick={submitReservation}>Reserve</button>
      </div>

      {!loading && reservations.length > 0 && (
        <div style={{ 
          display: "flex", 
          flexDirection: "column",
          gap: "15px", 
          margin: "20px 0"
        }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "10px",
            padding: "15px", 
            background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
            borderRadius: "12px"
          }}>
            <label style={{ fontWeight: "600", color: "#2c3e50" }}>🔍 Search:</label>
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, Table, Guests, Status, or Date..."
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "8px",
                border: "2px solid #e0e0e0",
                fontSize: "0.95rem"
              }}
            />
          </div>
          <div style={{ 
            display: "flex", 
            gap: "15px", 
            padding: "15px", 
            background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
            borderRadius: "12px",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label style={{ fontWeight: "600", color: "#2c3e50" }}>Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "2px solid #e0e0e0",
                  background: "white",
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  minWidth: "120px"
                }}
              >
                <option value="reservationTime">Date & Time</option>
                <option value="tableNumber">Table Number</option>
                <option value="numberOfGuests">Guests</option>
              </select>
              <select 
                value={sortDirection} 
                onChange={(e) => setSortDirection(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "2px solid #e0e0e0",
                  background: "white",
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  minWidth: "120px"
                }}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label style={{ fontWeight: "600", color: "#2c3e50" }}>Filter by Status:</label>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "2px solid #e0e0e0",
                  background: "white",
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  minWidth: "120px"
                }}
              >
                <option value="ALL">All Status</option>
                <option value="BOOKED">Booked</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="reservation-list">
        {loading ? <p>Loading reservations...</p> : reservations.length === 0 ? (
          <p>No reservations yet.</p>
        ) : getSortedAndFilteredReservations().length === 0 ? (
          <p>No reservations match your search.</p>
        ) : (
          getSortedAndFilteredReservations().map(r => (
            <div key={r.id} className="reservation-card">
              <p><strong>ID:</strong> {r.id}</p>
              <p><strong>Table:</strong> {r.tableNumber}</p>
              <p><strong>Date/Time:</strong> {new Date(r.reservationTime).toLocaleString()}</p>
              <p><strong>Guests:</strong> {r.numberOfGuests}</p>
              <p><strong>Status:</strong> {r.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reservation;
