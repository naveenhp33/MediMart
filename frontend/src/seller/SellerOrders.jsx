import { useEffect, useState, useContext } from "react";
import API from "../api/api";
import { ToastContext } from "../context/ToastContext";
import "./seller.css";

function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/seller/orders");
      setOrders(res.data);
    } catch (err) {
      showToast("Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status } : o));
      showToast(`Order marked as ${status}`);
    } catch (err) {
      showToast("Failed to update status");
    }
  };

  const getStatusStats = () => {
    const stats = { pending: 0, shipped: 0, delivered: 0 };
    orders.forEach(o => {
      if (stats[o.status] !== undefined) stats[o.status]++;
    });
    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className="page-container animate-fade-in">
      <div className="seller-dashboard-header">
        <h1>Order Management</h1>
        <p>Track your sales, fulfillments, and customer shipments.</p>
      </div>

      <div className="seller-mini-stats">
        <div className="mini-stat-card">
          <span className="stat-label">Pending</span>
          <span className="stat-value">{stats.pending}</span>
        </div>
        <div className="mini-stat-card">
          <span className="stat-label">Shipped</span>
          <span className="stat-value indigo">{stats.shipped}</span>
        </div>
        <div className="mini-stat-card">
          <span className="stat-label">Delivered</span>
          <span className="stat-value green">{stats.delivered}</span>
        </div>
      </div>

      <div className="admin-card" style={{ padding: "0" }}>
        <div className="table-responsive">
          <table className="medicine-table">
            <thead>
              <tr>
                <th>Order Details</th>
                <th>Customer & Address</th>
                <th>Ordered Items</th>
                <th>Revenue</th>
                <th>Current Status</th>
                <th>Fulfillment</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: "center", padding: "4rem" }}>Loading orders...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: "center", padding: "4rem" }}>No customer orders found yet. 🚀</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <div className="order-id-cell">
                        <span className="order-no">#{order._id.slice(-8).toUpperCase()}</span>
                        <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td>
                      <div className="customer-cell">
                        <strong>{order.customerName}</strong>
                        <span>{order.phone}</span>
                        <small className="order-address">{order.address}</small>
                      </div>
                    </td>
                    <td>
                      <div className="items-summary-list">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="item-pill">
                            {item.name} <span className="item-qty">x{item.qty}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td><span className="order-revenue">₹{order.total}</span></td>
                    <td>
                      <span className={`status-badge ${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <select 
                        value={order.status} 
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="premium-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="processed">Processed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SellerOrders;