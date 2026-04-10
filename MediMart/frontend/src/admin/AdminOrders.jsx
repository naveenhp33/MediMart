import { useEffect, useState, useContext } from "react";
import API from "../api/api";
import { ToastContext } from "../context/ToastContext";
import "./admin.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/orders");
      setOrders(res.data);
    } catch (err) {
      showToast("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="page-container animate-fade-in">
      <div className="admin-page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
            <h1>Order Ledger</h1>
            <div className="stat-badge">Total Transactions: {orders.length}</div>
        </div>

        <div className="admin-card">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Information</th>
                  <th>Order Summary</th>
                  <th>Revenue</th>
                  <th>Status Control</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ textAlign: "center", padding: "4rem" }}>Syncing order data...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: "center", padding: "4rem" }}>No transactions recorded yet.</td></tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o._id}>
                      <td>
                        <div className="admin-user-info">
                          <strong style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>#{o._id.slice(-8).toUpperCase()}</strong>
                          <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td>
                        <div className="admin-user-info">
                          <strong>{o.customerName}</strong>
                          <span>{o.phone}</span>
                        </div>
                      </td>
                      <td>
                         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {o.items.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className="role-badge customer" style={{ fontSize: '0.7rem' }}>
                                        {item.name}
                                    </span>
                                    <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
                                        via {item.sellerName || "MediMart"}
                                    </span>
                                </div>
                            ))}
                         </div>
                      </td>
                      <td>
                        <strong style={{ fontSize: '1.1rem' }}>₹{o.total}</strong>
                      </td>
                      <td>
                        <span className={`status-badge ${o.status}`}>
                          {o.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;