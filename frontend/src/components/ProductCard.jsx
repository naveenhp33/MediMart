import { useContext } from "react";
import { Link } from "react-router-dom";

import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { ToastContext } from "../context/ToastContext";

function ProductCard({ product }) {

const { addToCart } = useContext(CartContext);
const { addToWishlist } = useContext(WishlistContext);
const { showToast } = useContext(ToastContext);

const handleAddToCart = (e) => {

e.preventDefault();
e.stopPropagation();

if(product.stock === 0) return;

addToCart(product);

showToast("✓ Added to Cart");

};

const handleWishlist = (e)=>{

e.preventDefault();
e.stopPropagation();

addToWishlist(product);

showToast("❤️ Added to Wishlist");

};

return (
<div className="product-card">

<button
className="wishlist-btn"
onClick={handleWishlist}
>
❤️
</button>

<Link to={`/product/${product._id}`}>

<img
className="product-img"
src={product.imageUrl || "/placeholder.png"}
alt={product.name}
/>

<h3>{product.name}</h3>

</Link>

<p className="product-price">₹{product.price}</p>

<button
className="add-cart-btn"
onClick={handleAddToCart}
>
Add to Cart
</button>

</div>
);

}

export default ProductCard;