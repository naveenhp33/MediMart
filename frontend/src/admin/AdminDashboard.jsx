import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import "./admin.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    pendingSellers: 0,
    pendingProducts: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    API.get("/admin/stats").then((res) => setStats(res.data));
  }, []);

  return (
    <div className="page-container animate-fade-in">
      <div className="admin-page">
        <h1>Admin Command Center</h1>

        <div className="admin-stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <div className="stat-value">{stats.totalUsers}</div>
            <span>Platform Members</span>
          </div>
          <div className="stat-card">
            <h3>Active Medicines</h3>
            <div className="stat-value">{stats.totalProducts}</div>
            <span>Available for Purchase</span>
          </div>
          <div className="stat-card" style={{ borderColor: stats.pendingSellers > 0 ? "#F59E0B" : "var(--border)" }}>
            <h3>Pending Sellers</h3>
            <div className="stat-value" style={{ color: stats.pendingSellers > 0 ? "#F59E0B" : "" }}>
              {stats.pendingSellers}
            </div>
            <span>Waiting for Approval</span>
          </div>
          <div className="stat-card" style={{ borderColor: stats.pendingProducts > 0 ? "#EF4444" : "var(--border)" }}>
            <h3>Pending Medicines</h3>
            <div className="stat-value" style={{ color: stats.pendingProducts > 0 ? "#EF4444" : "" }}>
              {stats.pendingProducts}
            </div>
            <span>Security Review</span>
          </div>
        </div>

        <div className="admin-nav-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <Link to="/admin/products" className="stat-card" style={{ textDecoration: 'none', cursor: 'pointer' }}>
            <h3>💊 Medicine Management</h3>
            <p style={{ color: 'var(--text-muted)' }}>Approve or reject medicine listings from sellers.</p>
          </Link>
          <Link to="/admin/users" className="stat-card" style={{ textDecoration: 'none', cursor: 'pointer' }}>
            <h3>👥 User Verification</h3>
            <p style={{ color: 'var(--text-muted)' }}>Manage seller accounts and general user profiles.</p>
          </Link>
          <Link to="/admin/orders" className="stat-card" style={{ textDecoration: 'none', cursor: 'pointer' }}>
            <h3>📦 Order Insights</h3>
            <p style={{ color: 'var(--text-muted)' }}>Monitor and track all transactions across MediMart.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;