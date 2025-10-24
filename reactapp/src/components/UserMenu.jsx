import React, { useState, useEffect, useContext } from "react";
import "./UserMenu.css";
import { CartContext } from "./CartContext";
import { apiGet } from "../utils/api";

const UserMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [sortBy, setSortBy] = useState("itemName");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // Fetch full list (client-side pagination + filtering + sorting)
        const data = await apiGet("/api/menu");
        setMenuItems(Array.isArray(data) ? data : []);
      } catch (err) {
        alert(err.message);
      }
    };
    fetchMenu();
  }, []);

  // Filter and sort menu items
  const getFilteredMenuItems = () => {
    // Apply filters
    let items = menuItems.filter(item => {
      if (searchTerm === "") return true;
      return item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
             item.price.toString().includes(searchTerm);
    });

    // Apply sorting
    const sortMultiplier = sortDirection === "asc" ? 1 : -1;
    items.sort((a, b) => {
      let aVal, bVal;
      if (sortBy === "price") {
        aVal = parseFloat(a.price || 0);
        bVal = parseFloat(b.price || 0);
      } else if (sortBy === "category") {
        aVal = (a.category || "").toLowerCase();
        bVal = (b.category || "").toLowerCase();
      } else {
        // itemName (default)
        aVal = (a.itemName || "").toLowerCase();
        bVal = (b.itemName || "").toLowerCase();
      }
      
      if (aVal < bVal) return -1 * sortMultiplier;
      if (aVal > bVal) return 1 * sortMultiplier;
      return 0;
    });

    return items;
  };

  // Derived client-side pagination
  const filteredItems = getFilteredMenuItems();
  const derivedTotalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const displayedItems = filteredItems.slice(currentPage * pageSize, currentPage * pageSize + pageSize);

  return (
    <div className="user-menu">
      <h2>Menu</h2>

      <div className="menu-controls">
        <div className="search-controls">
          <label>🔍 Search:</label>
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }}
            placeholder="Search by name, category, or price..."
          />
        </div>
        <div className="sort-controls">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => {
            setSortBy(e.target.value);
            setCurrentPage(0);
          }}>
            <option value="itemName">Name</option>
            <option value="price">Price</option>
            <option value="category">Category</option>
          </select>
          <select value={sortDirection} onChange={(e) => {
            setSortDirection(e.target.value);
            setCurrentPage(0);
          }}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <div className="menu-info" style={{ padding: "10px", textAlign: "center", color: "#666", fontSize: "0.9rem" }}>
        Showing {displayedItems.length > 0 ? currentPage * pageSize + 1 : 0} - {Math.min((currentPage + 1) * pageSize, filteredItems.length)} of {filteredItems.length} items
      </div>

      <div className="menu-grid">
        {filteredItems.length === 0 ? (
          <div className="no-results">No menu items match your search.</div>
        ) : (
          displayedItems.map((item) => (
            <div key={item.id} className="menu-card">
              <div className="menu-name">{item.itemName}</div>
              <div>Category: {item.category}</div>
              <div>Price: ₹{item.price}</div>
              <div>Status: {item.available ? "Available" : "Unavailable"}</div>
              <button onClick={() => addToCart(item)} disabled={!item.available}>
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>

      <div className="pagination-controls">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span className="page-info">
          Page {Math.min(currentPage + 1, derivedTotalPages)} of {derivedTotalPages}
        </span>
        <button 
          onClick={() => setCurrentPage(prev => Math.min(derivedTotalPages - 1, prev + 1))}
          disabled={currentPage >= derivedTotalPages - 1}
        >
          Next
        </button>
        <select value={pageSize} onChange={(e) => {
          setPageSize(Number(e.target.value));
          setCurrentPage(0);
        }}>
          <option value="6">6 per page</option>
          <option value="12">12 per page</option>
          <option value="24">24 per page</option>
        </select>
      </div>
    </div>
  );
};

export default UserMenu;
