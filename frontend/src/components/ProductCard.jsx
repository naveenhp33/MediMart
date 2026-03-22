import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { ToastContext } from "../context/ToastContext";

function ProductCard({ product }) {
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);
  const { showToast } = useContext(ToastContext);

  const isSeller = user?.role === "seller";

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;
    addToCart(product);
    showToast("✓ Added to Cart");
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(product);
    showToast("❤️ Added to Wishlist");
  };

  return (
    <div className="product-card">
      {!isSeller && (
        <button className="wishlist-btn" onClick={handleWishlist} aria-label="Add to wishlist">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      )}

      <Link to={`/product/${product._id}`} className="product-link">
        <div className="product-image-container">
          <img className="product-img" src={product.imageUrl || "/placeholder.png"} alt={product.name} />
        </div>
        <div className="product-info">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3>{product.name}</h3>
            {product.requiresPrescription && (
                <span className="mini-presc-badge" title="Prescription Required">📄 Rx</span>
            )}
          </div>
          <p className="product-price">₹{product.price}</p>
        </div>

      </Link>

      {!isSeller && (
        <button className="add-cart-btn" onClick={handleAddToCart} disabled={product.stock === 0}>
          {product.stock === 0 ? (
            "Out of Stock"
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Add to Cart
            </>
          )}
        </button>
      )}
    </div>
  );
}

export default ProductCard;
