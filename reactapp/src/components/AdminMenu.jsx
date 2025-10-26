import React, { useState, useEffect } from "react";
import "./AdminMenu.css";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api";

const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [form, setForm] = useState({
    id: "",
    itemName: "",
    category: "",
    price: "",
    available: true,
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
    sodium: ""
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [sortBy, setSortBy] = useState("itemName");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterAvailability, setFilterAvailability] = useState("ALL");

  // Fetch menu items
  const fetchMenu = async () => {
    try {
      // Fetch full list (client-side pagination + filtering)
      const data = await apiGet("/api/menu");
      setMenuItems(Array.isArray(data) ? data : []);
    } catch (err) {
      alert("Failed to fetch menu: " + err.message);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Client-side search and filter
  const getFilteredMenuItems = () => {
    return menuItems.filter(item => {
      const matchesSearch = searchTerm === "" || 
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === "ALL" || (item.category && item.category.toLowerCase() === filterCategory.toLowerCase());
      const matchesAvailability = filterAvailability === "ALL" || 
        (filterAvailability === "AVAILABLE" ? item.available : !item.available);
      
      return matchesSearch && matchesCategory && matchesAvailability;
    });
  };

  // Derived client-side pagination values
  let filteredItems = getFilteredMenuItems();
  
  // Apply sorting
  const sortMultiplier = sortDirection === "asc" ? 1 : -1;
  filteredItems = filteredItems.sort((a, b) => {
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
  
  const derivedTotalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const displayedItems = filteredItems.slice(currentPage * pageSize, currentPage * pageSize + pageSize);

  // Get unique categories
  const getUniqueCategories = () => {
    const categories = [...new Set(menuItems.map(item => item.category))];
    return categories.sort();
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      let menuData;

      if (form.id) {
        // Update menu
        menuData = await apiPut(`/api/menu/${form.id}`, {
          itemName: form.itemName,
          category: form.category,
          price: parseFloat(form.price),
          available: form.available
        });

        // Fetch and update nutritional
        const nutData = await apiGet(`/api/nutritional/menu/${form.id}`);
        await apiPut(`/api/nutritional/${nutData.id}`, {
          calories: parseInt(form.calories),
          protein: parseFloat(form.protein),
          carbs: parseFloat(form.carbs),
          fat: parseFloat(form.fat),
          fiber: parseFloat(form.fiber),
          sodium: parseFloat(form.sodium),
          menu: { id: form.id }
        });

      } else {
        // Add new menu
        menuData = await apiPost("/api/menu", {
          itemName: form.itemName,
          category: form.category,
          price: parseFloat(form.price),
          available: form.available
        });

        // Add nutritional info
        await apiPost("/api/nutritional/add", {
          calories: parseInt(form.calories),
          protein: parseFloat(form.protein),
          carbs: parseFloat(form.carbs),
          fat: parseFloat(form.fat),
          fiber: parseFloat(form.fiber),
          sodium: parseFloat(form.sodium),
          menu: { id: menuData.id }
        });
      }

      // Reset form and refresh menu
      setForm({
        id: null,
        itemName: "",
        category: "",
        price: "",
        available: true,
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        fiber: "",
        sodium: ""
      });
      fetchMenu();

    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = async (item) => {
    try {
      const nutData = await apiGet(`/api/nutritional/menu/${item.id}`);

      setForm({
        id: item.id,
        itemName: item.itemName,
        category: item.category,
        price: item.price,
        available: item.available,
        calories: nutData.calories,
        protein: nutData.protein,
        carbs: nutData.carbs,
        fat: nutData.fat,
        fiber: nutData.fiber,
        sodium: nutData.sodium
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (item) => {
    try {
      // Fetch nutritional first
      const nutData = await apiGet(`/api/nutritional/menu/${item.id}`);

      // Delete nutritional
      await apiDelete(`/api/nutritional/${nutData.id}`);

      // Delete menu item
      await apiDelete(`/api/menu/${item.id}`);

      fetchMenu();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="admin-menu">
      <h2>Admin Menu Management</h2>

      <div className="menu-form">
        <input name="itemName" value={form.itemName} onChange={handleChange} placeholder="Item Name" />
        <select name="category" value={form.category} onChange={handleChange} className="category-dropdown">
          <option value="">Select Category</option>
          <option value="Pizza">Pizza</option>
          <option value="Desserts">Desserts</option>
          <option value="Beverages">Beverages</option>
          <option value="Sandwich">Sandwich</option>
          <option value="Burger">Burger</option>
          <option value="Pasta">Pasta</option>
          <option value="Salad">Salad</option>
          <option value="Fries">Fries</option>
          <option value="Coffee">Coffee</option>
        </select>
        <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" />
        <input name="calories" type="number" value={form.calories} onChange={handleChange} placeholder="Calories" />
        <input name="protein" type="number" value={form.protein} onChange={handleChange} placeholder="Protein" />
        <input name="carbs" type="number" value={form.carbs} onChange={handleChange} placeholder="Carbs" />
        <input name="fat" type="number" value={form.fat} onChange={handleChange} placeholder="Fat" />
        <input name="fiber" type="number" value={form.fiber} onChange={handleChange} placeholder="Fiber" />
        <input name="sodium" type="number" value={form.sodium} onChange={handleChange} placeholder="Sodium" />
        <button onClick={handleSubmit}>{form.id ? "Update Item" : "Add Item"}</button>
      </div>

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
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }}
            placeholder="Search by name or category..."
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
          <label style={{ fontWeight: "600", color: "#2c3e50" }}>Sort:</label>
          <select 
            value={sortBy} 
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(0);
            }}
            style={{
              padding: "8px 32px 8px 12px",
              borderRadius: "8px",
              border: "2px solid #e0e0e0",
              background: "white",
              cursor: "pointer",
              fontSize: "0.95rem",
              minWidth: "120px",
              appearance: "none",
              backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 8px center",
              backgroundSize: "16px"
            }}
          >
            <option value="itemName">Name</option>
            <option value="price">Price</option>
            <option value="category">Category</option>
          </select>
          <select 
            value={sortDirection} 
            onChange={(e) => {
              setSortDirection(e.target.value);
              setCurrentPage(0);
            }}
            style={{
              padding: "8px 32px 8px 12px",
              borderRadius: "8px",
              border: "2px solid #e0e0e0",
              background: "white",
              cursor: "pointer",
              fontSize: "0.95rem",
              minWidth: "120px",
              appearance: "none",
              backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 8px center",
              backgroundSize: "16px"
            }}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label style={{ fontWeight: "600", color: "#2c3e50" }}>Category:</label>
          <select 
            value={filterCategory} 
            onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(0); }}
            style={{
              padding: "8px 32px 8px 12px",
              borderRadius: "8px",
              border: "2px solid #e0e0e0",
              background: "white",
              cursor: "pointer",
              fontSize: "0.95rem",
              minWidth: "120px",
              appearance: "none",
              backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 8px center",
              backgroundSize: "16px"
            }}
          >
            <option value="ALL">All Categories</option>
            {getUniqueCategories().map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label style={{ fontWeight: "600", color: "#2c3e50" }}>Status:</label>
          <select 
            value={filterAvailability} 
            onChange={(e) => { setFilterAvailability(e.target.value); setCurrentPage(0); }}
            style={{
              padding: "8px 32px 8px 12px",
              borderRadius: "8px",
              border: "2px solid #e0e0e0",
              background: "white",
              cursor: "pointer",
              fontSize: "0.95rem",
              minWidth: "120px",
              appearance: "none",
              backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 8px center",
              backgroundSize: "16px"
            }}
          >
            <option value="ALL">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="UNAVAILABLE">Unavailable</option>
          </select>
        </div>
      </div>

      <div className="menu-info" style={{ padding: "10px", textAlign: "center", color: "#666", fontSize: "0.9rem" }}>
        Showing {displayedItems.length > 0 ? currentPage * pageSize + 1 : 0} - {Math.min((currentPage + 1) * pageSize, filteredItems.length)} of {filteredItems.length} items
      </div>

      <div className="menu-list">
        {filteredItems.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666", padding: "20px" }}>
            No menu items match your search/filter criteria
          </p>
        ) : (
          displayedItems.map((item) => (
            <div key={item.id} className="menu-item">
              <div>
                <strong>{item.itemName}</strong> ({item.category}) - ₹{item.price} {item.available ? "" : "(Unavailable)"}
              </div>
              <div className="menu-actions">
                <button className="edit-btn" onClick={() => handleEdit(item)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(item)}>Delete</button>
              </div>
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
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
        </select>
      </div>
    </div>
  );
};

export default AdminMenu;
