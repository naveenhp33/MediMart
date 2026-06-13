import { useEffect, useState, useContext } from "react";
import API from "../api/api";
import { ToastContext } from "../context/ToastContext";
import "./seller.css";

function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/seller/products");
      setProducts(res.data);
    } catch (err) {
      showToast("Error fetching medicines");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to remove this medicine?")) return;
    try {
      await API.delete(`/products/${id}`);
      showToast("Medicine removed successfully");
      fetchProducts();
    } catch (err) {
      showToast("Error removing medicine");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/products/${editingProduct._id}`, editingProduct);
      showToast("Medicine updated and sent for re-approval");
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      showToast("Error updating medicine");
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="seller-dashboard-header">
        <h1>Inventory Management</h1>
        <p>Monitor your stock levels and product approval status.</p>
      </div>

      <div className="admin-card" style={{ padding: "0" }}>
        <div className="table-responsive">
          <table className="medicine-table">
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Category</th>
                <th>Pricing</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: "center", padding: "4rem" }}>Loading your inventory...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: "center", padding: "4rem" }}>No medicines found. Start by adding one!</td></tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="table-product-cell">
                        <img src={p.imageUrl} alt={p.name} className="table-img" />
                        <div className="product-info">
                          <span className="product-name">{p.name}</span>
                          <span className="product-id">ID: {p._id.slice(-6).toUpperCase()}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="category-badge">{p.category}</span></td>
                    <td className="price-cell">₹{p.price}</td>
                    <td>
                      <span className={`stock-count ${p.stock < 10 ? 'low-stock' : ''}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${p.isApproved ? 'status-approved' : 'status-pending'}`}>
                        {p.isApproved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="icon-btn edit" onClick={() => setEditingProduct(p)} title="Edit Product">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        </button>
                        <button className="icon-btn delete" onClick={() => deleteProduct(p._id)} title="Delete Product">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingProduct && (
        <div className="modal-overlay">
          <div className="modal-content animate-slide-up">
            <div className="modal-header">
              <h3>Edit Medicine</h3>
              <button className="close-btn" onClick={() => setEditingProduct(null)}>&times;</button>
            </div>
            <form onSubmit={handleUpdate} className="premium-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} required/>
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} required/>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Stock</label>
                  <input type="number" value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: e.target.value})} required/>
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} required/>
                </div>
              </div>
              <div className="form-group">
                <label>Update Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    
                    const formData = new FormData();
                    formData.append("image", file);
                    
                    try {
                      showToast("Uploading new image...");
                      const res = await API.post("/upload/product", formData, {
                        headers: { "Content-Type": "multipart/form-data" }
                      });
                      setEditingProduct({ ...editingProduct, imageUrl: res.url || res.data.url });
                      showToast("New image uploaded");
                    } catch (err) {
                      showToast("Upload failed");
                    }
                  }}
                />
              </div>
              <button type="submit" className="submit-btn" style={{marginTop: "1rem"}}>Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerProducts;
