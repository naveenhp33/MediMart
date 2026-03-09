import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";

import "./Navbar.css";

function Navbar(){

const { user, logout } = useContext(AuthContext);

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

logout();
setOpen(false);
navigate("/");

};

return(

<nav className="navbar">

<h2 className="logo">MediMart</h2>

<div className="nav-links">

<Link to="/">Home</Link>

{/* CUSTOMER MENU */}

{user?.role === "customer" && (
<Link to="/cart">Cart</Link>
)}

{/* SELLER MENU */}

{user?.role === "seller" && (
<Link to="/seller">Seller Dashboard</Link>
)}

{/* ADMIN MENU */}

{user?.role === "admin" && (
<Link to="/admin">Admin Panel</Link>
)}

{/* WISHLIST */}

{user && (
<Link to="/wishlist"> Wishlist</Link>
)}

{/* PROFILE DROPDOWN */}

{user ? (

<div className="profile" ref={dropdownRef}>

<div
className="profile-name"
onClick={()=>setOpen(!open)}
>
{user.name} ▼
</div>

{open && (

<div className="dropdown">

{/* Profile */}

{user.role === "customer" && (
<Link to="/profile" onClick={()=>setOpen(false)}>
Profile
</Link>
)}

{/* Orders */}

{user.role !== "admin" && (
<Link to="/orders" onClick={()=>setOpen(false)}>
Orders
</Link>
)}



{/* Logout */}

<button onClick={handleLogout}>
Logout
</button>

</div>

)}

</div>

) : (

<Link to="/auth">Sign In</Link>

)}

</div>

</nav>

);

}

export default Navbar;