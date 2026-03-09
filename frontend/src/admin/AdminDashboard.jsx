import { Link } from "react-router-dom";
import "./admin.css";

function AdminDashboard(){

return(

<div className="admin-container">

<h1>Admin Dashboard</h1>

<div className="admin-cards">

<Link to="/admin/products" className="admin-card">
<h3>💊 All Medicines</h3>
<p>Manage medicines</p>
</Link>

<Link to="/admin/orders" className="admin-card">
<h3>📦 Orders</h3>
<p>View customer orders</p>
</Link>

<Link to="/admin/users" className="admin-card">
<h3>👥 Users</h3>
<p>Manage customers & sellers</p>
</Link>

</div>

</div>

)

}

export default AdminDashboard;