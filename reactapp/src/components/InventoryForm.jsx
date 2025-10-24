import React, { useState, useEffect } from "react";
import { apiGet, apiPost, apiPut } from "../utils/api";

const InventoryForm = ({ onInventoryChange, editingItem, setEditingItem }) => {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [storageLocation, setStorageLocation] = useState("");
  const [reorderLevel, setReorderLevel] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fetch suppliers on mount
  useEffect(() => {
    fetchSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Populate form when editingItem changes
  useEffect(() => {
    if (editingItem) {
      setItemName(editingItem.itemName);
      setQuantity(editingItem.quantity);
      setUnit(editingItem.unit);
      setStorageLocation(editingItem.storageLocation);
      setReorderLevel(editingItem.reorderLevel);
      setSelectedSupplier(editingItem.supplier?.id?.toString() || "");
      setEditingId(editingItem.id);
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingItem]);

  const fetchSuppliers = async () => {
    try {
      const data = await apiGet("/api/suppliers/allSuppliers");
      setSuppliers(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setItemName("");
    setQuantity("");
    setUnit("");
    setStorageLocation("");
    setReorderLevel("");
    setSelectedSupplier("");
    setEditingId(null);
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSupplier) return alert("Select a supplier");

    const body = {
      itemName,
      quantity,
      unit,
      storageLocation,
      reorderLevel,
      supplier: { id: selectedSupplier },
    };

    try {
      if (editingId) {
        await apiPut(`/api/inventory/${editingId}`, body);
      } else {
        await apiPost("/api/inventory/addInventory", body);
      }

      resetForm();
      onInventoryChange();
      alert(editingId ? "Inventory updated" : "Inventory added");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="inventory-form">
      <div className="inventory-form-grid">
        <input
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Item Name"
          required
        />
        <input
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity"
          required
        />
        <input
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="Unit"
          required
        />
        <input
          value={storageLocation}
          onChange={(e) => setStorageLocation(e.target.value)}
          placeholder="Storage Location"
          required
        />
        <input
          value={reorderLevel}
          onChange={(e) => setReorderLevel(e.target.value)}
          placeholder="Reorder Level"
          required
        />
        <select
          value={selectedSupplier}
          onChange={(e) => setSelectedSupplier(e.target.value)}
          required
        >
          <option value="">Select Supplier</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id.toString()}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <div className="inventory-form-actions">
        <button type="submit">{editingId ? "Update" : "Add"} Inventory</button>
        {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
      </div>
    </form>
  );
};

export default InventoryForm;
