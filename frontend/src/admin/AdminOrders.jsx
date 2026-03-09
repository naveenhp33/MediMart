import { useEffect,useState } from "react";
import API from "../api/api";
import "./admin.css";

function AdminOrders(){

const [orders,setOrders] = useState([]);

useEffect(()=>{

API.get("/orders")
.then(res=>setOrders(res.data));

},[]);

return(

<div className="admin-container">

<h2>All Orders</h2>

<table className="admin-table">

<thead>
<tr>
<th>Customer</th>
<th>Phone</th>
<th>Total</th>
<th>Status</th>
</tr>
</thead>

<tbody>

{orders.map(o=>(
<tr key={o._id}>

<td>{o.customerName}</td>
<td>{o.phone}</td>
<td>₹{o.total}</td>
<td>{o.status}</td>

</tr>
))}

</tbody>

</table>

</div>

)

}

export default AdminOrders;