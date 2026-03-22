import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import { CartContext } from "../context/CartContext";
import { ToastContext } from "../context/ToastContext";
import "./orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const { addToCart } = useContext(CartContext);
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      let res;
      if (user.role === "seller") {
        res = await API.get(`/seller/orders/${user._id}`);
      } else {
        res = await API.get("/orders");
      }
      const sortedOrders = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sortedOrders);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRefill = (items) => {
    items.forEach((item) => {
      addToCart({ ...item, _id: item.productId });
    });
    showToast("Essential medicines re-added for refill");
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

  const updateDelivery = async (id, deliveryDate) => {
    try {
      await API.put(`/orders/${id}/delivery`, { deliveryDate });
      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

  const getStep = (status) => {
    switch (status) {
      case "Pending": return 1;
      case "Processing": return 2;
      case "Shipped": return 3;
      case "Delivered": return 4;
      default: return 1;
    }
  };

  const getDeliveryDate = (order) => {
    if (order.deliveryDate) {
      const date = new Date(order.deliveryDate);
      if (order.status === "Delivered") return `Delivered on ${date.toDateString()}`;
      return `Estimated Delivery: ${date.toDateString()}`;
    }
    const orderDate = new Date(order.createdAt);
    let deliveryDays = 3;
    if (order.status === "Shipped") deliveryDays = 1;
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(orderDate.getDate() + deliveryDays);
    return `Calculated Delivery: ${deliveryDate.toDateString()}`;
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="orders-page">
        <h1>Order History & Tracking</h1>

        {orders.length === 0 && (
          <div style={{ textAlign: "center", padding: "5rem" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "1.25rem" }}>No orders available at the moment.</p>
          </div>
        )}

        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
                <span className="order-id">#ORD-{order._id.slice(-6).toUpperCase()}</span>
                {user.role === "seller" && (
                  <input
                    type="date"
                    className="delivery-picker"
                    value={order.deliveryDate ? order.deliveryDate.split("T")[0] : ""}
                    onChange={(e) => updateDelivery(order._id, e.target.value)}
                    title="Set Delivery Date"
                  />
                )}
                {order.prescriptionUrl && user.role === "seller" && (
                  <a href={order.prescriptionUrl} target="_blank" rel="noreferrer" className="prescription-badge">
                    📄 View Medical Prescription
                  </a>
                )}
              </div>

              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <Link to={`/invoice/${order._id}`} className="invoice-link-btn">
                  Download Invoice
                </Link>
                {user.role === "customer" ? (
                  <span className={`order-status ${order.status?.toLowerCase() || "pending"}`}>{order.status || "Pending"}</span>
                ) : (
                  <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)} className="status-selector">
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                )}
              </div>
            </div>

            <div className="order-tracker-container">
              <p className="delivery-date">{getDeliveryDate(order)}</p>
              <div className="order-tracker">
                <div className={`step ${getStep(order.status) >= 1 ? "active" : ""}`}>
                  <span>Ordered</span>
                </div>
                <div className={`step ${getStep(order.status) >= 2 ? "active" : ""}`}>
                  <span>Processing</span>
                </div>
                <div className={`step ${getStep(order.status) >= 3 ? "active" : ""}`}>
                  <span>Shipped</span>
                </div>
                <div className={`step ${getStep(order.status) >= 4 ? "active" : ""}`}>
                  <span>Delivered</span>
                </div>
              </div>
            </div>

            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <img src={item.image || item.imageUrl || "/placeholder.png"} alt={item.name} className="order-img" />
                  <div className="order-item-info">
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.qty}</p>
                  </div>
                  <p className="order-price">₹{item.price}</p>
                </div>
              ))}
            </div>

            <div className="order-footer-details" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', padding: '1rem', borderTop: '1px solid var(--border)' }}>
              <div className="order-total" style={{ margin: 0 }}>Total: ₹{order.total}</div>
              {user.role === "customer" && order.status === "Delivered" && (
                <button className="add-cart-btn" style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem' }} onClick={() => handleRefill(order.items)}>
                  Repeat Order (Refill)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;