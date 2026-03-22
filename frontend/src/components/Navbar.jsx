import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ToastContext } from "../context/ToastContext";

import "./Navbar.css";

function Navbar(){

const { user, logout } = useContext(AuthContext);
const { showToast } = useContext(ToastContext);


const [open,setOpen] = useState(false);

const navigate = useNavigate();
const location = useLocation();

const dropdownRef = useRef(null);

/* Close dropdown when page changes */

useEffect(()=>{
setOpen(false);
},[location]);

/* Close dropdown when clicking outside */

useEffect(()=>{

const handleClickOutside = (e)=>{

if(dropdownRef.current && !dropdownRef.current.contains(e.target)){
setOpen(false);
}

};

document.addEventListener("mousedown",handleClickOutside);

return ()=>{
document.removeEventListener("mousedown",handleClickOutside);
};

},[]);

/* Logout */

const handleLogout = () => {
  showToast("👋 Logged out. See you soon!");
  logout();
  setOpen(false);
  navigate("/");
};


  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        MediMart
      </div>

      <div className="nav-links">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>

        {/* CUSTOMER MENU */}
        {user?.role === "customer" && (
          <Link to="/cart" className={location.pathname === "/cart" ? "active" : ""}>Cart</Link>
        )}

        {/* SELLER MENU */}
        {user?.role === "seller" && (
          <Link to="/seller" className={location.pathname === "/seller" ? "active" : ""}>Dashboard</Link>
        )}

        {/* ADMIN MENU */}
        {user?.role === "admin" && (
          <Link to="/admin" className={location.pathname === "/admin" ? "active" : ""}>Admin</Link>
        )}

        {/* WISHLIST (Customers Only) */}
        {user?.role === "customer" && (
          <Link to="/wishlist" className={location.pathname === "/wishlist" ? "active" : ""}>Wishlist</Link>
        )}

        {/* ORDERS (Sellers Only - in Wishlist spot) */}
        {user?.role === "seller" && (
          <Link to="/orders" className={location.pathname === "/orders" ? "active" : ""}>Orders</Link>
        )}



        {/* PROFILE DROPDOWN */}
        {user ? (
          <div className="profile-container" ref={dropdownRef}>
            <div
              className="profile-trigger"
              onClick={() => setOpen(!open)}
            >
              <span>{user.name}</span>
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: '0.2s' }}
              >
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </div>

            {open && (
              <div className="dropdown animate-fade-in">
                {user.role === "customer" && (
                  <Link to="/profile" onClick={() => setOpen(false)}>
                    My Profile
                  </Link>
                )}

                {user.role !== "admin" && (
                  <Link to="/orders" onClick={() => setOpen(false)}>
                    My Orders
                  </Link>
                )}
                
                <div className="dropdown-divider"></div>

                <button onClick={handleLogout} style={{ color: '#EF4444' }}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/auth" className="profile-trigger">Sign In</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;