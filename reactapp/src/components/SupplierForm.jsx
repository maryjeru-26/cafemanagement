import React, { useState, useEffect } from "react";
import { apiPost, apiPut } from "../utils/api";

const SupplierForm = ({ onSupplierChange, editingSupplier, resetEditing }) => {
  const [name, setName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [products, setProducts] = useState("");
  const [rating, setRating] = useState("");
  const [contractDetails, setContractDetails] = useState("");

  // Update form fields when editingSupplier changes
  useEffect(() => {
    if (editingSupplier) {
      setName(editingSupplier.name || "");
      setContactInfo(editingSupplier.contactInfo || "");
      setProducts(editingSupplier.products || "");
      setRating(editingSupplier.rating || "");
      setContractDetails(editingSupplier.contractDetails || "");
    } else {
      // reset form if no editing
      setName("");
      setContactInfo("");
      setProducts("");
      setRating("");
      setContractDetails("");
    }
  }, [editingSupplier]);

  const resetForm = () => {
    setName("");
    setContactInfo("");
    setProducts("");
    setRating("");
    setContractDetails("");
    resetEditing();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = { name, contactInfo, products, rating, contractDetails };

    try {
      if (editingSupplier?.id) {
        await apiPut(`/api/suppliers/${editingSupplier.id}`, body);
      } else {
        await apiPost("/api/suppliers/addSupplier", body);
      }

      alert(editingSupplier?.id ? "Supplier updated" : "Supplier added");
      onSupplierChange();
      resetForm();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="supplier-form">
      <div className="supplier-form-grid">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} placeholder="Contact Info" required />
        <input value={products} onChange={(e) => setProducts(e.target.value)} placeholder="Products" required />
        <input value={rating} onChange={(e) => setRating(e.target.value)} placeholder="Rating" required />
        <input value={contractDetails} onChange={(e) => setContractDetails(e.target.value)} placeholder="Contract Details" required />
      </div>
      <div className="supplier-form-actions">
        <button type="submit">{editingSupplier?.id ? "Update" : "Add"} Supplier</button>
        {editingSupplier?.id && <button type="button" onClick={resetForm}>Cancel</button>}
      </div>
    </form>
  );
};

export default SupplierForm;
