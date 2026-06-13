import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { ToastContext } from "../context/ToastContext";
import "../App.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const handleBuyNow = () => {
    if (product.stock === 0) return;
    navigate("/order", { state: { buyNowItem: { ...product, qty: 1 } } });
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
            <div className="seller-meta" style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="seller-badge" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Sold by: <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{product.sellerId?.name || "Official Store"}</span>
              </div>
              {user && (
                <button 
                    className="report-btn" 
                    style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={async () => {
                        const msg = window.prompt("What is your concern about this seller?");
                        if (msg) {
                            try {
                                await API.post('/user/complaint', { sellerId: product.sellerId?._id, message: msg });
                                showToast("⚠️ Feedback sent to seller");
                            } catch (err) {
                                showToast("Error sending feedback");
                            }
                        }
                    }}
                >
                  Report Seller
                </button>
              )}
            </div>
          )}


          {!isSeller && (
            <div className="detail-actions">
              <button className="buy-now-btn" onClick={handleBuyNow} disabled={product.stock === 0} style={{ flex: 1 }}>
                Buy Product Now
              </button>
              <button className="add-cart-btn" onClick={handleAddToCart} disabled={product.stock === 0} style={{ flex: 1 }}>
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
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

      {/* REVIEWS SECTION */}
      <div className="reviews-section" style={{ marginTop: '3rem', padding: '2rem', background: 'white', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
        <h2>Customer Reviews ({product.reviews?.length || 0})</h2>
        
        {product.averageRating > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{product.averageRating.toFixed(1)}</span>
            <div style={{ color: '#F59E0B' }}>
              {'★'.repeat(Math.round(product.averageRating))}{'☆'.repeat(5 - Math.round(product.averageRating))}
            </div>
          </div>
        )}

        <div className="reviews-list">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{rev.userName}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
                <div style={{ color: '#F59E0B', fontSize: '0.8rem', margin: '0.25rem 0' }}>
                  {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                </div>
                <p style={{ margin: '0.5rem 0' }}>{rev.comment}</p>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No reviews yet. Be the first to review this product!</p>
          )}
        </div>

        {/* REVIEW FORM */}
        {user && !isSeller && (
          <div className="add-review-form" style={{ marginTop: '2.5rem', borderTop: '2px solid var(--border-light)', paddingTop: '2rem' }}>
            <h3>Leave a Review</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const rating = e.target.rating.value;
              const comment = e.target.comment.value;
              try {
                const res = await API.post(`/products/${product._id}/review`, { rating, comment });
                setProduct(res.data);
                e.target.reset();
                showToast("✓ Review submitted");
              } catch (err) {
                showToast("⚠️ Error submitting review");
              }
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Rating</label>
                <select name="rating" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <option value="5">5 Stars - Excellent</option>
                  <option value="4">4 Stars - Very Good</option>
                  <option value="3">3 Stars - Good</option>
                  <option value="2">2 Stars - Fair</option>
                  <option value="1">1 Star - Poor</option>
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Your Comment</label>
                <textarea name="comment" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', minHeight: '100px' }} placeholder="Share your experience with this medicine..."></textarea>
              </div>
              <button type="submit" className="add-cart-btn" style={{ width: 'auto' }}>Post Review</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;

