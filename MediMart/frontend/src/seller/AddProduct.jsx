import { useState, useContext } from "react";
import API from "../api/api";
import { ToastContext } from "../context/ToastContext";
import "./seller.css";

function AddProduct() {
  const { showToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      await API.post("/products", product);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="seller-dashboard-header">
        <h1>Add New Inventory</h1>
        <p>Register new medicine stock into the MediMart ecosystem.</p>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="premium-form">
          <div className="form-row">
            <div className="form-group">
              <label>Medicine Name</label>
              <input name="name" placeholder="e.g. Paracetamol 500mg" value={product.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input name="category" placeholder="e.g. Pain Relief" value={product.category} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price (₹)</label>
              <input name="price" type="number" placeholder="0.00" value={product.price} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Initial Stock Count</label>
              <input name="stock" type="number" placeholder="Enter quantity" value={product.stock} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Expiry Date</label>
              <input name="expiryDate" type="date" value={product.expiryDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Product Image</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  
                  const formData = new FormData();
                  formData.append("image", file);
                  
                  try {
                    const res = await API.post("/upload/product", formData, {
                      headers: { "Content-Type": "multipart/form-data" }
                    });
                    setProduct({ ...product, imageUrl: res.url || res.data.url });
                    showToast("Image uploaded successfully");
                  } catch (err) {
                    showToast("Image upload failed");
                  }
                }}
                required={!product.imageUrl}
              />
              {product.imageUrl && <p className="success-text" style={{fontSize: '0.8rem', color: 'var(--primary)'}}>✓ Image ready</p>}
            </div>
          </div>

          <div className="form-group">
            <label>Full Clinical Description</label>
            <textarea name="description" rows="4" placeholder="Detail the usage, indications, and side effects..." value={product.description} onChange={handleChange} required />
          </div>

          <div className="form-checkbox-group">
            <div className="checker">
              <input name="requiresPrescription" type="checkbox" id="presc" checked={product.requiresPrescription} onChange={handleChange} />
              <div className="check-box"></div>
            </div>
            <label htmlFor="presc">
              <strong>Requires Prescription</strong>
              <span>Check this if the medicine requires a doctor's verify to purchase.</span>
            </label>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit for Verification"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
