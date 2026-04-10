import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./cart.css";

function Cart() {

const { cart, increaseQty, decreaseQty, removeFromCart } = useContext(CartContext);

const navigate = useNavigate();

/* totals */

const itemCount = cart.reduce((acc,item)=>acc + item.qty,0);

const subtotal = cart.reduce((acc,item)=>acc + item.price * item.qty,0);

const delivery = subtotal > 0 ? 40 : 0;

const total = subtotal + delivery;


/* ---------------- EMPTY CART ---------------- */

if (cart.length === 0) {

return (

<div className="empty-cart">

<h2>Your Cart is Empty</h2>

<p>Add medicines to your cart to continue shopping.</p>

<button
className="checkout-btn"
onClick={()=>navigate("/")}
>
Browse Medicines
</button>

</div>

);

}


/* ---------------- CART PAGE ---------------- */

return (

<div className="cart-page">

<h1 className="cart-title">Shopping Cart</h1>

<div className="cart-wrapper">

{/* ---------------- CART ITEMS ---------------- */}

<div className="cart-items">

{cart.map((item) => (

<div key={item._id} className="cart-item">

<img
src={item.imageUrl || item.image || "/placeholder.png"}
alt={item.name}
className="cart-img"
/>

<div className="cart-info">

<h3>{item.name}</h3>

<p className="price">₹{item.price}</p>

<div className="qty-controls">

<button onClick={() => decreaseQty(item._id)}>
-
</button>

<span>{item.qty}</span>

<button onClick={() => increaseQty(item._id)}>
+
</button>

</div>

</div>

<div className="cart-actions">

<p className="subtotal">
₹{item.price * item.qty}
</p>

<button
className="remove-btn"
onClick={() => removeFromCart(item._id)}
>
Remove
</button>

</div>

</div>

))}

</div>


{/* ---------------- ORDER SUMMARY ---------------- */}

<div className="cart-summary">

<h2>Order Summary</h2>

<div className="summary-row">
<span>Items</span>
<span>{itemCount}</span>
</div>

<div className="summary-row">
<span>Subtotal</span>
<span>₹{subtotal}</span>
</div>

<div className="summary-row">
<span>Delivery Fee</span>
<span>₹{delivery}</span>
</div>

<div className="summary-row total-row">
<span>Total</span>
<span>₹{total}</span>
</div>

<button
className="checkout-btn"
onClick={() => navigate("/order")}
>
Proceed to Checkout
</button>

</div>

</div>

</div>

);

}

export default Cart;