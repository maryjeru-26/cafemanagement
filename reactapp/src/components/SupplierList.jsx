import React, { useEffect, useState } from "react";
import SupplierForm from "./SupplierForm";
import "./SupplierList.css";
import { apiGet, apiDelete } from "../utils/api";

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterRating, setFilterRating] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSuppliers = async () => {
    try {
      const data = await apiGet("/api/suppliers/allSuppliers");
      setSuppliers(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this supplier?")) return;
    try {
      await apiDelete(`/api/suppliers/${id}`);
      fetchSuppliers();
    } catch (err) {
      alert(err.message);
    }
  };

  const resetEditing = () => setEditingSupplier(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Sort and filter suppliers
  const getSortedAndFilteredSuppliers = () => {
    let filtered = suppliers.filter(s => {
      const matchesSearch = searchTerm === "" || 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.contactInfo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.products || "").toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesRating = true;
      if (filterRating !== "ALL") {
        const minRating = parseInt(filterRating);
        matchesRating = Math.floor(s.rating || 0) >= minRating;
      }
      
      return matchesSearch && matchesRating;
    });

    return [...filtered].sort((a, b) => {
      let compareValue = 0;
      
      if (sortBy === "name") {
        compareValue = a.name.localeCompare(b.name);
      } else if (sortBy === "rating") {
        compareValue = (a.rating || 0) - (b.rating || 0);
      } else if (sortBy === "products") {
        compareValue = (a.products || "").localeCompare(b.products || "");
      }
      
      return sortDirection === "asc" ? compareValue : -compareValue;
    });
  };

  return (
    <div className="supplier-container">
      <SupplierForm onSupplierChange={fetchSuppliers} editingSupplier={editingSupplier} resetEditing={resetEditing} />
      
      <div style={{ 
        display: "flex", 
        gap: "15px", 
        marginBottom: "20px", 
        padding: "15px", 
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        borderRadius: "12px",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: "1", minWidth: "250px" }}>
          <label style={{ fontWeight: "600", color: "#2c3e50" }}>🔍 Search:</label>
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, contact or products..."
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "8px",
              border: "2px solid #e0e0e0",
              fontSize: "0.95rem",
              minWidth: "200px"
            }}
          />
        </div>
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
            <option value="name">Name</option>
            <option value="rating">Rating</option>
            <option value="products">Products</option>
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
          <label style={{ fontWeight: "600", color: "#2c3e50" }}>Filter by Rating:</label>
          <select 
            value={filterRating} 
            onChange={(e) => setFilterRating(e.target.value)}
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
            <option value="ALL">All Ratings</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="1">1+ Stars</option>
          </select>
        </div>
      </div>
      <table className="supplier-table">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Contact</th><th>Products</th><th>Rating</th><th>Contract</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {getSortedAndFilteredSuppliers().map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.contactInfo}</td>
              <td>{s.products}</td>
              <td>
                <div className="supplier-rating">
                  <span className="stars">{"★".repeat(Math.floor(s.rating || 0))}</span>
                  <span className="score">{s.rating || 0}/5</span>
                </div>
              </td>
              <td>{s.contractDetails}</td>
              <td>
                <div className="supplier-actions">
                  <button className="edit-btn" onClick={() => setEditingSupplier(s)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(s.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierList;
