import { Link } from "react-router-dom";
import "./seller.css";

function SellerDashboard(){

const user = JSON.parse(localStorage.getItem("user"));

return(

<div className="seller-dashboard">

<h1>Seller Dashboard</h1>

<p className="welcome">Welcome back, {user?.name} 👋</p>


{/* STATS */}

<div className="stats">

<div className="stat-card">
<h3>Total Medicines</h3>
<p>12</p>
</div>

<div className="stat-card">
<h3>Total Orders</h3>
<p>8</p>
</div>

<div className="stat-card">
<h3>Revenue</h3>
<p>₹5400</p>
</div>

</div>


{/* ACTION CARDS */}

<div className="actions">

<Link to="/seller/add-product" className="action-card">
<h3>➕ Add Medicine</h3>
<p>Add new medicine to your store</p>
</Link>

<Link to="/seller/products" className="action-card">
<h3>💊 My Medicines</h3>
<p>Manage your medicines</p>
</Link>

<Link to="/seller/orders" className="action-card">
<h3>📦 Orders</h3>
<p>View customer orders</p>
</Link>

</div>

</div>

)

}

export default SellerDashboard;