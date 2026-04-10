import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import "./seller.css";

function SellerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [stats, setStats] = useState({ productCount: 0, orderCount: 0, revenue: 0 });

  useEffect(() => {
    API.get("/seller/stats").then((res) => setStats(res.data));
  }, []);

  return (
    <div className="page-container animate-fade-in">
      <div className="seller-dashboard-header">
        <h1>Welcome back, {user?.name} 👋</h1>
        <p>Here is your clinical performance overview for today.</p>
      </div>

      <div className="stats">
        <div className="stat-card premium">
          <div className="stat-icon-wrapper purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M21 12H3"/><path d="M12 3v18"/></svg>
          </div>
          <div className="stat-info">
            <h3>Total Inventory</h3>
            <p>{stats.productCount}</p>
          </div>
        </div>
        <div className="stat-card premium">
          <div className="stat-icon-wrapper indigo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>
          </div>
          <div className="stat-info">
            <h3>Current Orders</h3>
            <p>{stats.orderCount}</p>
          </div>
        </div>
        <div className="stat-card premium">
          <div className="stat-icon-wrapper green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <p>₹{stats.revenue?.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="actions">
        <Link to="/seller/add-product" className="action-card">
          <div className="action-icon-bg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
          <div className="action-text">
            <h3>Add Medicine</h3>
            <p>Register new clinical stock items.</p>
          </div>
        </Link>

        <Link to="/seller/products" className="action-card">
          <div className="action-icon-bg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <div className="action-text">
            <h3>Manage Stock</h3>
            <p>Update or remove existing inventory.</p>
          </div>
        </Link>

        <Link to="/seller/orders" className="action-card">
          <div className="action-icon-bg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </div>
          <div className="action-text">
            <h3>Ship Orders</h3>
            <p>Fulfill pending customer purchases.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default SellerDashboard;