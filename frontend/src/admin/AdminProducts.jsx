import { useEffect, useState, useContext } from "react";
import API from "../api/api";
import { ToastContext } from "../context/ToastContext";
import "./admin.css";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [pending, setPending] = useState([]);
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const allRes = await API.get("/products");
      const pendingRes = await API.get("/admin/products/pending");
      setProducts(allRes.data);
      setPending(pendingRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  const approveProduct = async (id, isApproved) => {
    try {
      await API.put(`/admin/products/${id}/approve`, { isApproved });
      showToast(isApproved ? "Medicine Approved" : "Medicine Rejected");
      fetchData();
    } catch (err) {
      showToast("Verification failed");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Permanently delete this medicine from the store?")) return;
    try {
      await API.delete(`/products/${id}`);
      showToast("Product deleted");
      fetchData();
    } catch (err) {
      showToast("Deletion failed");
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="admin-page">
        <div className="admin-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1>Medicine Verification</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '-2.5rem' }}>Review and manage clinical inventory across the platform.</p>
          </div>
          <button className="approve-btn" onClick={fetchData} style={{ background: 'var(--surface)', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
            Refresh Data
          </button>
        </div>

        {/* PENDING APPROVALS */}
        <section style={{ marginBottom: "5rem" }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <span className="stat-badge" style={{ background: '#fef2f2', color: '#ef4444' }}>Security Queue</span>
            <h2 style={{ margin: 0 }}>🚨 Pending Approval Request ({pending.length})</h2>
          </div>
          
          <div className="admin-card">
            {pending.length === 0 ? (
              <div style={{ padding: "5rem 2rem", textAlign: "center" }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                <h3 style={{ color: "var(--text-main)" }}>Security Queue Clear</h3>
                <p style={{ color: "var(--text-muted)" }}>No new medicines are currently awaiting verification.</p>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Medicine Details</th>
                    <th>Merchant Credential</th>
                    <th>Price</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <div className="product-info-cell">
                          <img src={p.imageUrl || "/placeholder.png"} className="admin-img" alt="" />
                          <div className="admin-user-info">
                            <strong>{p.name}</strong>
                            <span>{p.category}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="admin-user-info">
                          <strong>{p.sellerId?.name || "Unknown"}</strong>
                          <span>{p.sellerId?.email}</span>
                        </div>
                      </td>
                      <td><strong style={{ color: 'var(--text-main)' }}>₹{p.price}</strong></td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="admin-actions" style={{ justifyContent: 'flex-end' }}>
                          <button className="approve-btn" onClick={() => approveProduct(p._id, true)}>
                            Verify & Approve
                          </button>
                          <button className="reject-btn" onClick={() => deleteProduct(p._id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* ALL PRODUCTS */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <span className="stat-badge">Live Inventory</span>
            <h2 style={{ margin: 0 }}>All Live Medicines ({products.length})</h2>
          </div>

          <div className="admin-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Origin Merchant</th>
                  <th>Unit Stock</th>
                  <th>Pricing</th>
                  <th style={{ textAlign: 'right' }}>Admin Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="product-info-cell">
                        <img src={p.imageUrl || "/placeholder.png"} className="admin-img" alt="" />
                        <div className="admin-user-info">
                          <strong>{p.name}</strong>
                          <span style={{ fontSize: '0.75rem' }}>ID: {p._id.slice(-6).toUpperCase()}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="admin-user-info">
                        <strong>{p.sellerId?.name || "Internal Stock"}</strong>
                        <span>{p.sellerId?.email}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`stat-badge ${p.stock < 10 ? 'red' : ''}`} style={{ background: p.stock < 10 ? '#fef2f2' : '#f0fdf4', color: p.stock < 10 ? '#ef4444' : '#22c55e', fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}>
                        {p.stock} units
                      </span>
                    </td>
                    <td><strong style={{ color: 'var(--text-main)' }}>₹{p.price}</strong></td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="delete-btn" onClick={() => deleteProduct(p._id)}>
                        Remove Listing
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminProducts;