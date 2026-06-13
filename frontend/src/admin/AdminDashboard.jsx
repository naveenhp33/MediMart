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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/admin/stats")
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Dashboard Stats Fetch Error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-container animate-fade-in">
      <div className="admin-page">
        <h1>Admin Command Center</h1>

        <div className="admin-stats-grid">
          <Link to="/admin/users" className="stat-card premium clickable">
            <div className="stat-icon-wrapper blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div className="stat-info">
              <h3>Total Users</h3>
              <div className="stat-value">{stats.totalUsers}</div>
              <span>Platform Members</span>
            </div>
          </Link>

          <Link to="/admin/products" className="stat-card premium clickable">
            <div className="stat-icon-wrapper green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m14.7 12.8-5.2-5.2M13.5 13.9l-2.6-2.6"/><circle cx="12" cy="12" r="10"/><path d="m14.7 11.2-1.4 1.4-1.4-1.4 1.4-1.4 1.4 1.4z"/></svg>
            </div>
            <div className="stat-info">
              <h3>Approved Meds</h3>
              <div className="stat-value">{stats.totalProducts}</div>
              <span>Live Listings</span>
            </div>
          </Link>

          <Link to="/admin/users" className="stat-card premium clickable" style={{ borderColor: stats.pendingSellers > 0 ? "#F59E0B" : "var(--border)" }}>
            <div className="stat-icon-wrapper orange">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
            </div>
            <div className="stat-info">
              <h3>Waitlist Sellers</h3>
              <div className="stat-value" style={{ color: stats.pendingSellers > 0 ? "#F59E0B" : "" }}>
                {stats.pendingSellers}
              </div>
              <span>Awaiting Review</span>
            </div>
          </Link>

          <Link to="/admin/products" className="stat-card premium clickable" style={{ borderColor: stats.pendingProducts > 0 ? "#EF4444" : "var(--border)" }}>
            <div className="stat-icon-wrapper red">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <div className="stat-info">
              <h3>Restricted Meds</h3>
              <div className="stat-value" style={{ color: stats.pendingProducts > 0 ? "#EF4444" : "" }}>
                {stats.pendingProducts}
              </div>
              <span>Security Queue</span>
            </div>
          </Link>
        </div>

        <div className="admin-nav-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
          <Link to="/admin/products" className="admin-nav-item">
            <div className="nav-icon">💊</div>
            <div>
              <h3>Medicine Approvals</h3>
              <p>Verify and activate new clinical listings.</p>
            </div>
          </Link>
          <Link to="/admin/users" className="admin-nav-item">
            <div className="nav-icon">👥</div>
            <div>
              <h3>Seller Verification</h3>
              <p>Onboard and manage merchant credentials.</p>
            </div>
          </Link>
          <Link to="/admin/orders" className="admin-nav-item">
            <div className="nav-icon">📦</div>
            <div>
              <h3>Order Ledger</h3>
              <p>Monitor transaction health and delivery statuses.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;