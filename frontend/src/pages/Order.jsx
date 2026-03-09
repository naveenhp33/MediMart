import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import "./order.css";

function Order(){

const { cart, clearCart } = useContext(CartContext);

const [name,setName] = useState("");
const [phone,setPhone] = useState("");
const [address,setAddress] = useState("");
const [payment,setPayment] = useState("");

const navigate = useNavigate();

const total = cart.reduce((a,b)=>a + b.price * b.qty,0);

/* PLACE ORDER */

const placeOrder = async ()=>{

if(cart.length === 0){
alert("Cart is empty");
return;
}

if(!name || !phone || !address){
alert("Please fill all details");
return;
}

if(!payment){
alert("Select payment method");
return;
}

try{

await API.post("/orders",{

customerName:name,
phone,
address,
paymentMethod:payment,

items: cart.map(item => ({
productId: item._id,
name: item.name,
price: item.price,
qty: item.qty,
image: item.imageUrl || item.image || "/placeholder.png"
})),

total

});

/* CLEAR CART */

clearCart();

/* REDIRECT */

navigate("/success");

}catch(err){

console.log(err);
alert("Order failed");

}

};

return(

<div className="order-page">

<h1>Checkout</h1>

<div className="order-container">

{/* DELIVERY DETAILS */}

<div className="order-form">

<h2>Delivery Details</h2>

<input
type="text"
placeholder="Full Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<input
type="text"
placeholder="Phone Number"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
/>

<textarea
placeholder="Delivery Address"
value={address}
onChange={(e)=>setAddress(e.target.value)}
/>

{/* PAYMENT METHOD */}

<div className="payment-method">

<h3>Payment Method</h3>

<div className="payment-options">

<label className="payment-option">
<input type="radio" name="payment" value="UPI" onChange={(e)=>setPayment(e.target.value)}/>
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/UPI-Logo-vector.svg/512px-UPI-Logo-vector.svg.png" alt="UPI"/>
<span>UPI</span>
</label>

<label className="payment-option">
<input type="radio" name="payment" value="Google Pay" onChange={(e)=>setPayment(e.target.value)}/>
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png" alt="Google Pay"/>
<span>Google Pay</span>
</label>

<label className="payment-option">
<input type="radio" name="payment" value="PhonePe" onChange={(e)=>setPayment(e.target.value)}/>
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/512px-PhonePe_Logo.svg.png" alt="PhonePe"/>
<span>PhonePe</span>
</label>

<label className="payment-option">
<input type="radio" name="payment" value="Credit Card" onChange={(e)=>setPayment(e.target.value)}/>
<img src="https://cdn-icons-png.flaticon.com/512/633/633611.png" alt="Card"/>
<span>Credit / Debit Card</span>
</label>

</div>

</div>

<button onClick={placeOrder}>
Confirm Order
</button>

</div>

{/* ORDER SUMMARY */}

<div className="order-summary">

<h2>Order Summary</h2>

{cart.map((item)=>(
<div key={item._id} className="summary-item">

<img
src={item.imageUrl || item.image || "/placeholder.png"}
alt={item.name}
/>

<div>
<p>{item.name}</p>
<p>Qty: {item.qty}</p>
</div>

<span>₹{item.price * item.qty}</span>

</div>
))}

<div className="summary-total">
<span>Total</span>
<span>₹{total}</span>
</div>

</div>

</div>

</div>

)

}

export default Order;