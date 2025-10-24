import React, { useEffect, useState } from "react";
import InventoryForm from "./InventoryForm";
import "./InventoryList.css";
import { apiGet, apiDelete } from "../utils/api";

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [sortBy, setSortBy] = useState("itemName");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterLevel, setFilterLevel] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchInventory = async () => {
    try {
      const data = await apiGet("/api/inventory/allInventory");
      setInventory(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleEdit = (item) => {
    setEditingItem(item); // send to form
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this inventory?")) return;
    try {
      await apiDelete(`/api/inventory/${id}`);
      fetchInventory();
    } catch (err) {
      alert(err.message);
    }
  };

  // Sort and filter inventory
  const getSortedAndFilteredInventory = () => {
    let filtered = inventory.filter(inv => {
      const matchesSearch = searchTerm === "" || 
        inv.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (inv.storageLocation || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (inv.supplier?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesLevel = true;
      if (filterLevel === "LOW") {
        matchesLevel = inv.quantity < inv.reorderLevel;
      } else if (filterLevel === "MEDIUM") {
        matchesLevel = inv.quantity >= inv.reorderLevel && inv.quantity < inv.reorderLevel * 2;
      } else if (filterLevel === "HIGH") {
        matchesLevel = inv.quantity >= inv.reorderLevel * 2;
      }
      
      return matchesSearch && matchesLevel;
    });

    return [...filtered].sort((a, b) => {
      let compareValue = 0;
      
      if (sortBy === "itemName") {
        compareValue = a.itemName.localeCompare(b.itemName);
      } else if (sortBy === "quantity") {
        compareValue = a.quantity - b.quantity;
      } else if (sortBy === "reorderLevel") {
        compareValue = a.reorderLevel - b.reorderLevel;
      } else if (sortBy === "storageLocation") {
        compareValue = (a.storageLocation || "").localeCompare(b.storageLocation || "");
      }
      
      return sortDirection === "asc" ? compareValue : -compareValue;
    });
  };

  return (
    <div className="inventory-container">
      <InventoryForm
        onInventoryChange={fetchInventory}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
      />

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
            placeholder="Search by item, storage or supplier..."
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
            <option value="itemName">Item Name</option>
            <option value="quantity">Quantity</option>
            <option value="reorderLevel">Reorder Level</option>
            <option value="storageLocation">Storage</option>
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
          <label style={{ fontWeight: "600", color: "#2c3e50" }}>Filter by Stock:</label>
          <select 
            value={filterLevel} 
            onChange={(e) => setFilterLevel(e.target.value)}
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
            <option value="ALL">All Levels</option>
            <option value="LOW">Low Stock</option>
            <option value="MEDIUM">Medium Stock</option>
            <option value="HIGH">High Stock</option>
          </select>
        </div>
      </div>

      <table className="inventory-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Item</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Storage</th>
            <th>Reorder</th>
            <th>Supplier</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {getSortedAndFilteredInventory().map((inv) => (
            <tr key={inv.id}>
              <td>{inv.id}</td>
              <td>{inv.itemName}</td>
              <td>
                <span className={`inventory-quantity ${inv.quantity < inv.reorderLevel ? 'low' : inv.quantity < inv.reorderLevel * 2 ? 'medium' : 'high'}`}>
                  {inv.quantity}
                </span>
              </td>
              <td>{inv.unit}</td>
              <td>{inv.storageLocation}</td>
              <td>{inv.reorderLevel}</td>
              <td>{inv.supplier?.name || "N/A"}</td>
              <td>
                <div className="inventory-actions">
                  <button className="edit-btn" onClick={() => handleEdit(inv)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(inv.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryList;
