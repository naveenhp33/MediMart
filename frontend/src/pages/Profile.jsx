import { useState, useContext } from "react";
import { ToastContext } from "../context/ToastContext";
import "./profile.css";

function Profile() {
  const { showToast } = useContext(ToastContext);
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState(storedUser?.name || "");
  const [email, setEmail] = useState(storedUser?.email || "");
  const [phone, setPhone] = useState(storedUser?.phone || "");
  const [address, setAddress] = useState(storedUser?.address || "");

  const handleUpdate = () => {
    const updatedUser = {
      ...storedUser,
      name,
      email,
      phone,
      address
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    showToast("✓ Profile changes saved");
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="profile-page-modern">
        <div className="profile-header-modern">
          <h1>Account Settings</h1>
          <p>Manage your health profile and delivery credentials.</p>
        </div>

        <div className="profile-layout-modern">
          {/* PROFILE PREVIEW CARD */}
          <div className="profile-preview-card">
            <div className="profile-avatar-premium">
              {name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div className="profile-brief">
              <h2>{name || "Anonymous User"}</h2>
              <span className="profile-role-badge">{storedUser?.role?.toUpperCase() || "CUSTOMER"}</span>
              <p>{email}</p>
            </div>
            <div className="profile-meta-info">
              <div className="meta-item">
                <span>Joined</span>
                <strong>MediMart Member</strong>
              </div>
            </div>
          </div>

          {/* EDIT FORM CONTAINER */}
          <div className="profile-edit-form">
            <div className="form-section-header">
              <h3>Personal Information</h3>
            </div>

            <div className="modern-form-grid">
              <div className="form-group-modern">
                <label>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group-modern">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  style={{ background: '#f8fafc', color: '#94a3b8' }}
                  title="Email cannot be changed"
                />
              </div>

              <div className="form-group-modern">
                <label>Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter mobile number"
                />
              </div>

              <div className="form-group-modern full-width">
                <label>Delivery Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, City, Zip Code"
                />
              </div>
            </div>

            <div className="form-actions-modern">
              <button className="profile-save-btn" onClick={handleUpdate}>
                Save Profile Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;