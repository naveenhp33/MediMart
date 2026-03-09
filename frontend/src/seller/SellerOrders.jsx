import { useEffect,useState } from "react";
import API from "../api/api";
import "./seller.css";

function SellerOrders(){

const [orders,setOrders] = useState([]);

const user = JSON.parse(localStorage.getItem("user"));

useEffect(()=>{

API.get(`/seller/orders/${user._id}`)
.then(res=>setOrders(res.data));

},[]);

return(

<div className="seller-orders">

<h2>Customer Orders</h2>

<table className="orders-table">

<thead>

<tr>
<th>Customer</th>
<th>Phone</th>
<th>Address</th>
<th>Total</th>
<th>Status</th>
</tr>

</thead>

<tbody>

{orders.map(order=>(
<tr key={order._id}>

<td>{order.customerName}</td>

<td>{order.phone}</td>

<td>{order.address}</td>

<td>₹{order.total}</td>

<td>{order.status}</td>

</tr>
))}

</tbody>

</table>

</div>

)

}

export default SellerOrders;