import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import "../App.css";

function ProductCard({ product }) {

const { addToCart } = useContext(CartContext);
const { addToWishlist } = useContext(WishlistContext);

const [showToast,setShowToast] = useState(false);

/* ADD TO CART */

const handleAddToCart = (e) => {

e.stopPropagation();
e.preventDefault();

if(product.stock === 0) return;

addToCart(product);

/* SHOW TOAST */

setShowToast(true);

setTimeout(()=>{
setShowToast(false);
},3000);

};

/* ADD TO WISHLIST */

const handleWishlist = (e)=>{

e.stopPropagation();
e.preventDefault();

addToWishlist(product);

};

return (

<div className="product-card">

{/* WISHLIST BUTTON */}

<button
className="wishlist-btn"
onClick={handleWishlist}
>
❤️
</button>

<Link to={`/product/${product._id}`} className="product-link">

<img
className="product-img"
src={product.imageUrl || "/placeholder.png"}
alt={product.name}
/>

<h3>{product.name}</h3>

</Link>

<p className="product-price">₹{product.price}</p>

{/* STOCK STATUS */}

{product.stock > 10 && (
<p className="stock-green">In Stock</p>
)}

{product.stock <= 10 && product.stock > 0 && (
<p className="stock-yellow">Low Stock</p>
)}

{product.stock === 0 && (
<p className="stock-red">Out of Stock</p>
)}

{/* ADD TO CART */}

<button
className="add-cart-btn"
onClick={handleAddToCart}
disabled={product.stock === 0}
>

{product.stock === 0 ? "Unavailable" : "Add to Cart"}

</button>

{/* TOAST MESSAGE */}

{showToast && (
<div className="cart-toast">
✔ Added to cart
</div>
)}

</div>

);

}

export default ProductCard;