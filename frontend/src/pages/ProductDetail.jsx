import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { ToastContext } from "../context/ToastContext";
import "../App.css";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);
  const { showToast } = useContext(ToastContext);

  const isSeller = user?.role === "seller";

  useEffect(() => {
    API.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product)
    return (
      <div className="page-container" style={{ textAlign: "center", padding: "5rem" }}>
        <div className="loading-spinner"></div>
        <p>Fetching product details...</p>
      </div>
    );

  const handleAddToCart = () => {
    addToCart(product);
    showToast("Added to Cart");
  };

  const handleWishlist = () => {
    addToWishlist(product);
    showToast("Added to Wishlist");
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="detail-card">
        <div className="detail-image-container">
          <img src={product.imageUrl || "/placeholder.png"} alt={product.name} className="detail-img" />
        </div>

        <div className="detail-info">
          <div className="detail-category">{product.category || "General"}</div>
          <h1 className="detail-title">{product.name}</h1>
          <p className="detail-description">{product.description || "No description available for this product."}</p>
          <div className="detail-price">₹{product.price}</div>

          {product.requiresPrescription && (
            <div className="prescription-required-info" style={{ marginTop: '1.5rem', padding: '1.25rem', background: '#FFFBEB', border: '1px solid #F59E0B', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>📄</span>
                <strong style={{ color: '#B45309', fontSize: '1rem' }}>Prescription Required</strong>
              </div>
              <p style={{ color: '#92400E', fontSize: '0.875rem', margin: 0 }}>
                This is a regulated medical product. You will be required to upload a valid doctor's prescription during the checkout process to complete this purchase.
              </p>
            </div>
          )}


          {!isSeller && (
            <div className="detail-actions">
              <button className="add-cart-btn detail-cart-btn" onClick={handleAddToCart} disabled={product.stock === 0}>
                {product.stock === 0 ? "Out of Stock" : "Add to Shopping Cart"}
              </button>
              <button className="detail-wish-btn" title="Add to Wishlist" onClick={handleWishlist}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;

