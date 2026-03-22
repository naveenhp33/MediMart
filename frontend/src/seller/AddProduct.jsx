import { useState, useContext } from "react";
import API from "../api/api";
import { ToastContext } from "../context/ToastContext";

function AddProduct() {
  const { showToast } = useContext(ToastContext);
  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    imageUrl: "",
    description: "",
    requiresPrescription: false,
    expiryDate: "",
  });

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setProduct({
      ...product,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await API.post("/products", product, {
        headers: { Authorization: token },
      });
      showToast("Medicine submitted for Admin approval");
      setProduct({
        name: "",
        price: "",
        category: "",
        stock: "",
        imageUrl: "",
        description: "",
        requiresPrescription: false,
        expiryDate: "",
      });
    } catch (err) {
      showToast("Error adding medicine");
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="seller-dashboard-header">
        <h1>Add New Inventory</h1>
        <p>Ensure all medical details are accurate before submission.</p>
      </div>

      <div className="admin-card" style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem" }}>
        <form onSubmit={handleSubmit} className="order-form" style={{ gap: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <input name="name" placeholder="Medicine Name" value={product.name} onChange={handleChange} required />
            <input name="category" placeholder="Category (e.g. Vitamins)" value={product.category} onChange={handleChange} required />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <input name="price" type="number" placeholder="Price (₹)" value={product.price} onChange={handleChange} required />
            <input name="stock" type="number" placeholder="Initial Stock" value={product.stock} onChange={handleChange} required />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div className="input-with-label">
              <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>
                Medicine Expiry Date
              </label>
              <input name="expiryDate" type="date" value={product.expiryDate} onChange={handleChange} required />
            </div>
            <input name="imageUrl" placeholder="Medicine Image URL" value={product.imageUrl} onChange={handleChange} required />
          </div>

          <textarea name="description" placeholder="Full Medical Description (Usage, Side Effects, etc.)" value={product.description} onChange={handleChange} required />

          <div className="checkbox-container" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", background: "rgba(0,102,255,0.05)", borderRadius: "var(--radius-md)" }}>
            <input name="requiresPrescription" type="checkbox" id="presc" checked={product.requiresPrescription} onChange={handleChange} style={{ width: "20px", height: "20px" }} />
            <label htmlFor="presc" style={{ fontWeight: "600", color: "var(--primary)" }}>
              Requires Doctor's Prescription for Purchase
            </label>
          </div>

          <button type="submit" className="add-cart-btn" style={{ padding: "1.25rem", fontSize: "1rem" }}>
            Submit for Approval
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;