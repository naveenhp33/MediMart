import { Link } from "react-router-dom";
import "./success.css";

function Success() {
  return (
    <div className="page-container flex-center animate-fade-in">
      <div className="success-card">
        <div className="success-icon-wrapper">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        
        <h1>Order Placed Successfully!</h1>
        <p>Your healthcare essentials are being prepared for delivery. We've sent the confirmation and receipt to your email.</p>
        
        <div className="success-actions">
          <Link to="/orders" className="primary-action-btn">
            View My Orders
          </Link>
          <Link to="/" className="secondary-action-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Success;