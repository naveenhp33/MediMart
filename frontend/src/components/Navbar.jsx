import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ToastContext } from "../context/ToastContext";
import API from "../api/api";

import "./Navbar.css";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  const [open, setOpen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const navigate = useNavigate();
  const location = useLocation();

  const dropdownRef = useRef(null);
  const notesRef = useRef(null);

  useEffect(() => {
    setOpen(false);
    setShowNotes(false);
  }, [location.pathname]);

  // Fetch notifications
  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 5000); // Check every 5 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(prev => {
        const newUnread = res.data.filter(n => !n.isRead);
        const prevUnreadIds = prev.filter(n => !n.isRead).map(n => n._id);
        
        // Find if there's any totally new notification ID that wasn't in our previous unread list
        const hasNewNote = newUnread.some(n => !prevUnreadIds.includes(n._id));
        
        if (hasNewNote && prev.length > 0) {
          showToast("🔔 New notification received!");
        }
        return res.data;
      });
    } catch (err) {
      console.error("Notifications fetch failed");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (notesRef.current && !notesRef.current.contains(e.target)) {
        setShowNotes(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    showToast("👋 Logged out. See you soon!");
    logout();
    setOpen(false);
    navigate("/");
  };

  const markAsRead = async (id) => {
    try {
      if (typeof id === 'string' && id.startsWith('refill-')) {
          setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
          return;
      }
      await API.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error("Failed to mark as read");
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        MediMart
      </div>

      <div className="nav-links">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>

        {user?.role === "customer" && (
          <Link to="/cart" className={location.pathname === "/cart" ? "active" : ""}>Cart</Link>
        )}

        {user?.role === "seller" && (
          <Link to="/seller" className={location.pathname === "/seller" ? "active" : ""}>Dashboard</Link>
        )}

        {user?.role === "admin" && (
          <Link to="/admin" className={location.pathname === "/admin" ? "active" : ""}>Admin</Link>
        )}

        {user?.role === "customer" && (
          <Link to="/wishlist" className={location.pathname === "/wishlist" ? "active" : ""}>Wishlist</Link>
        )}

        {user?.role === "seller" && (
          <Link to="/orders" className={location.pathname === "/orders" ? "active" : ""}>Orders</Link>
        )}

        {user && (
          <div className="profile-container">
            {/* NOTIFICATION BELL (Visible to all logged in users) */}
            <div className="notification-wrapper" ref={notesRef}>
              <div 
                className="notification-container" 
                onClick={() => setShowNotes(!showNotes)}
                title="Notifications"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </div>

              {showNotes && (
                <div className="notification-dropdown animate-fade-in">
                  <div className="notification-header">
                    <h4>Notifications</h4>
                    {unreadCount > 0 && (
                      <button 
                        className="mark-all-btn"
                        onClick={async () => {
                          try {
                            await API.put("/notifications/read-all");
                            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                          } catch (err) {
                            console.error("Mark all as read failed");
                          }
                        }}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  
                  <div className="notification-list">
                    {notifications.length === 0 ? (
                      <div className="no-notifications">
                        {user.role === 'seller' ? "No news yet! Your store is looking good. 🏪" : "All quiet here! Go buy something healthy. 😋"}
                      </div>
                    ) : (
                      notifications.map((note, idx) => (
                        <div 
                          key={note._id || `note-${idx}`} 
                          className={`notification-item ${!note.isRead ? 'unread' : ''} type-${note.type}`}
                          onClick={() => !note.isRead && markAsRead(note._id)}
                        >
                          <div className="note-icon">
                            {note.type === 'offer' ? '🎁' : note.type === 'reminder' ? '⏱️' : '🔔'}
                          </div>
                          <div className="note-content">
                            <h5>{note.title}</h5>
                            <p>{note.message}</p>
                            <span className="note-time">{new Date(note.createdAt).toLocaleDateString()}</span>
                          </div>
                          {!note.isRead && <span className="unread-dot"></span>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* PROFILE MENU */}
            <div className="profile-dropdown-wrapper" ref={dropdownRef}>
              <div className="profile-trigger" onClick={() => setOpen(!open)}>
                <span>{user.name}</span>
                <svg
                  width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: '0.2s' }}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>

              {open && (
                <div className="dropdown">
                  {user.role === "customer" && (
                    <Link to="/profile" onClick={() => setOpen(false)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      My Profile
                    </Link>
                  )}
                  {user.role !== "admin" && (
                    <Link to="/orders" onClick={() => setOpen(false)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                      My Orders
                    </Link>
                  )}
                  <button onClick={handleLogout} className="logout-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {!user && (
          <Link to="/auth" className="profile-trigger shimmer-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;