import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import "./wishlist.css";

function Wishlist(){

const { wishlist, removeFromWishlist } = useContext(WishlistContext);
const { addToCart } = useContext(CartContext);

if(wishlist.length === 0){

return(

<div className="empty-wishlist">

<h2>Your Wishlist is Empty</h2>

<Link to="/">Browse Medicines</Link>

</div>

);

}

return(

<div className="wishlist-page">

<h1 className="wishlist-title">❤️ My Wishlist</h1>

<div className="wishlist-grid">

{wishlist.map(item => (

<div key={item._id} className="wishlist-card">

<img
src={item.imageUrl || "/placeholder.png"}
className="wishlist-img"
alt={item.name}
/>

<h3>{item.name}</h3>

<p className="wishlist-price">₹{item.price}</p>

<div className="wishlist-actions">

<button
className="add-btn"
onClick={() => addToCart(item)}
>
Add to Cart
</button>

<button
className="remove-btn"
onClick={() => removeFromWishlist(item._id)}
>
Remove
</button>

</div>

</div>

))}

</div>

</div>

);

}

export default Wishlist;