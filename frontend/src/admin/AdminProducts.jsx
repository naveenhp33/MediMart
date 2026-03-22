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
        <h1>Medicine Verification</h1>

        {/* PENDING APPROVALS */}
        <section style={{ marginBottom: "5rem" }}>
          <h2>🚨 Pending Approval Request ({pending.length})</h2>
          <div className="admin-card">
            {pending.length === 0 ? (
              <p style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                No new medicines waiting for approval.
              </p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Seller</th>
                    <th>Price</th>
                    <th>Actions</th>
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
                      <td>₹{p.price}</td>
                      <td>
                        <div className="admin-actions">
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
          <h2>All Live Medicines ({products.length})</h2>
          <div className="admin-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Sellers</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="product-info-cell">
                        <img src={p.imageUrl || "/placeholder.png"} className="admin-img" alt="" />
                        <strong>{p.name}</strong>
                      </div>
                    </td>
                    <td>{p.sellerId?.name || "External Seller"}</td>
                    <td>{p.stock}</td>
                    <td>₹{p.price}</td>
                    <td>
                      <button className="delete-btn" onClick={() => deleteProduct(p._id)}>
                        Remove
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