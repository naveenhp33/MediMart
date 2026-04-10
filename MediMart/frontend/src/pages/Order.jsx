import { useState, useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import API from "../api/api";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContext } from "../context/ToastContext";
import "./order.css";

function Order() {
  const { cart, clearCart } = useContext(CartContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle "Buy Now" vs "Cart Checkout"
  const [orderItems, setOrderItems] = useState([]);
  const [isDirectBuy, setIsDirectBuy] = useState(false);

  useEffect(() => {
    if (location.state?.buyNowItem) {
      setOrderItems([location.state.buyNowItem]);
      setIsDirectBuy(true);
    } else {
      setOrderItems(cart);
      setIsDirectBuy(false);
    }
  }, [location.state, cart]);

  const updateOrderQty = (id, delta) => {
    setOrderItems(prev => prev.map(item => {
      if (item._id === id) {
        const newQty = Math.max(0, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  // Saved Addresses
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(-1);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);

  // Address Form State (for new or editing)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine: ""
  });

  const [payment, setPayment] = useState("");
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [prescriptionUrl, setPrescriptionUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const total = orderItems.reduce((a, b) => a + b.price * b.qty, 0);
  const needsPrescription = orderItems.some((item) => item.requiresPrescription);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await API.get("/user/address");
      setAddresses(res.data);
      if (res.data.length > 0) {
        // Find primary or select first
        const primaryIdx = res.data.findIndex(a => a.isPrimary);
        setSelectedAddressIndex(primaryIdx !== -1 ? primaryIdx : 0);
      } else {
        setIsAddingNew(true);
      }
    } catch (err) {
      console.error("Error fetching addresses", err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("prescription", file);

    try {
      setLoading(true);
      const res = await API.post("/upload/prescription", form);
      setPrescriptionUrl(res.data.url);
      setPrescriptionFile(file);
      showToast("Verification document uploaded");
    } catch (err) {
      showToast("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!formData.fullName || !formData.phone || !formData.addressLine) {
      showToast("Please fill all address fields");
      return;
    }

    try {
      setLoading(true);
      let updatedAddresses;
      if (editingIndex !== -1) {
        const res = await API.put(`/user/address/${editingIndex}`, formData);
        updatedAddresses = res.data;
      } else {
        const res = await API.post("/user/address", formData);
        updatedAddresses = res.data;
      }
      setAddresses(updatedAddresses);
      setSelectedAddressIndex(editingIndex !== -1 ? editingIndex : updatedAddresses.length - 1);
      setEditingIndex(-1);
      setIsAddingNew(false);
      setFormData({ fullName: "", phone: "", addressLine: "" });
      showToast("Address saved successfully");
    } catch (err) {
      showToast("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (e, index) => {
    e.stopPropagation();
    if (!window.confirm("Delete this address?")) return;
    try {
      const res = await API.delete(`/user/address/${index}`);
      setAddresses(res.data);
      if (selectedAddressIndex === index) {
        setSelectedAddressIndex(res.data.length > 0 ? 0 : -1);
        if (res.data.length === 0) setIsAddingNew(true);
      } else if (selectedAddressIndex > index) {
        setSelectedAddressIndex(prev => prev - 1);
      }
      showToast("Address deleted");
    } catch (err) {
      showToast("Error deleting address");
    }
  };

  const placeOrder = async () => {
    if (orderItems.length === 0) {
      showToast("No items to order");
      return;
    }

    let finalName, finalPhone, finalAddress;

    // If first time or adding new during checkout, we must have valid form data
    if (isAddingNew) {
      if (!formData.fullName || !formData.phone || !formData.addressLine) {
        showToast("Please fill delivery details");
        return;
      }
      // Save address first if first time ordering
      if (addresses.length === 0) {
        try {
          const res = await API.post("/user/address", formData);
          setAddresses(res.data);
        } catch (err) {
          console.error("Auto-save address failed");
        }
      }
      finalName = formData.fullName;
      finalPhone = formData.phone;
      finalAddress = formData.addressLine;
    } else {
      const selected = addresses[selectedAddressIndex];
      finalName = selected.fullName;
      finalPhone = selected.phone;
      finalAddress = selected.addressLine;
    }

    if (needsPrescription && !prescriptionUrl) {
      showToast("Prescription upload is mandatory for this order");
      return;
    }

    if (!payment) {
      showToast("Please select a payment method");
      return;
    }

    try {
      setLoading(true);
      await API.post("/orders", {
        customerName: finalName,
        phone: finalPhone,
        address: finalAddress,
        paymentMethod: payment,
        prescriptionUrl,
        items: orderItems.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          sellerId: item.sellerId?._id || item.sellerId,
          image: item.imageUrl || item.image || "/placeholder.png",
        })),
        total,
      });

      if (!isDirectBuy) {
        clearCart();
      }
      showToast("Order placed successfully");
      navigate("/success");
    } catch (err) {
      showToast("Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container animate-fade-in" style={{ maxWidth: '1200px' }}>
      {/* STEP INDICATOR */}
      <div className="checkout-steps">
        <div className="step active">
          <div className="step-num">1</div>
          <span>Information</span>
        </div>
        <div className="step-line"></div>
        <div className="step active">
          <div className="step-num">2</div>
          <span>Verification</span>
        </div>
        <div className="step-line"></div>
        <div className="step">
          <div className="step-num">3</div>
          <span>Payment</span>
        </div>
      </div>

      <div className="checkout-main-grid">
        {/* LEFT COLUMN: DETAILS */}
        <div className="checkout-details-column">
          {/* ADDRESS SECTION */}
          <section className="checkout-section">
            <div className="section-header">
              <div className="header-icon">📍</div>
              <h2>Delivery Address</h2>
            </div>

            <div className="address-grid">
              {addresses.map((addr, idx) => (
                <div 
                  key={idx} 
                  className={`checkout-address-card ${selectedAddressIndex === idx && !isAddingNew ? 'selected' : ''}`}
                  onClick={() => { setSelectedAddressIndex(idx); setIsAddingNew(false); }}
                >
                  <div className="selection-indicator"></div>
                  <div className="addr-content">
                    <span className="addr-name">{addr.fullName}</span>
                    <span className="addr-phone">{addr.phone}</span>
                    <p className="addr-line">{addr.addressLine}</p>
                  </div>
                  <div className="addr-actions">
                    <button onClick={(e) => { e.stopPropagation(); setFormData(addr); setEditingIndex(idx); setIsAddingNew(true); }}>Edit</button>
                    <button onClick={(e) => handleDeleteAddress(e, idx)}>Delete</button>
                  </div>
                </div>
              ))}
              <div className={`checkout-address-card add-new ${isAddingNew ? 'active' : ''}`} onClick={() => { setIsAddingNew(true); setEditingIndex(-1); setFormData({fullName:"", phone:"", addressLine:""}); }}>
                <span className="plus-icon">+</span>
                <span>Add New Address</span>
              </div>
            </div>

            {isAddingNew && (
              <div className="address-form-inline">
                <div className="premium-form-card">
                  <h3>{editingIndex !== -1 ? "Edit Address" : "New Delivery Address"}</h3>
                  <div className="form-row">
                    <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} required />
                    <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
                  </div>
                  <textarea name="addressLine" placeholder="Street Address, Area, Landmark" value={formData.addressLine} onChange={e => setFormData({...formData, addressLine: e.target.value})} required />
                  <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={() => setIsAddingNew(false)}>Cancel</button>
                    <button type="button" className="save-btn" onClick={handleSaveAddress}>Save Address</button>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* PRESCRIPTION SECTION */}
          {needsPrescription && (
            <section className="checkout-section priority-card">
              <div className="section-header">
                <div className="header-icon">📄</div>
                <h2>Clinical Verification</h2>
              </div>
              <div className="prescription-upload-box">
                <div className="presc-info">
                  <p>Order contains <strong>Prescribed</strong> medicine.</p>
                  <span>Upload your verification document to proceed.</span>
                </div>
                <div className="upload-trigger">
                  {prescriptionUrl ? (
                    <div className="file-ready">
                      <div className="status-icon">✅</div>
                      <span>Document Uploaded</span>
                      <button onClick={() => setPrescriptionUrl("")}>Change</button>
                    </div>
                  ) : (
                    <label className="upload-btn">
                      <input type="file" onChange={handleFileUpload} accept="image/*,.pdf" hidden />
                      <div className="btn-content">
                        <span>{loading ? "Uploading..." : "Click to Upload"}</span>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* PAYMENT SECTION */}
          <section className="checkout-section">
            <div className="section-header">
              <div className="header-icon">💳</div>
              <h2>Select Payment Method</h2>
            </div>
            <div className="payment-options-grid">
              <label className={`payment-tile ${payment === 'PhonePe' ? 'selected' : ''}`}>
                <input type="radio" value="PhonePe" checked={payment === "PhonePe"} onChange={e => setPayment(e.target.value)} hidden />
                <div className="payment-brand">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/512px-PhonePe_Logo.svg.png" alt="PhonePe" />
                  <span>PhonePe</span>
                </div>
                <div className="dot"></div>
              </label>

              <label className={`payment-tile ${payment === 'GPay' ? 'selected' : ''}`}>
                <input type="radio" value="GPay" checked={payment === "GPay"} onChange={e => setPayment(e.target.value)} hidden />
                <div className="payment-brand">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png" alt="GPay" />
                  <span>Google Pay</span>
                </div>
                <div className="dot"></div>
              </label>

              <label className={`payment-tile ${payment === 'Paytm' ? 'selected' : ''}`}>
                <input type="radio" value="Paytm" checked={payment === "Paytm"} onChange={e => setPayment(e.target.value)} hidden />
                <div className="payment-brand">
                  <img src="https://logodownload.org/wp-content/uploads/2021/01/paytm-logo-0.png" alt="Paytm" />
                  <span>Paytm</span>
                </div>
                <div className="dot"></div>
              </label>

              <label className={`payment-tile ${payment === 'Card' ? 'selected' : ''}`}>
                <input type="radio" value="Card" checked={payment === "Card"} onChange={e => setPayment(e.target.value)} hidden />
                <div className="payment-brand">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  <span>Credit/Debit Card</span>
                </div>
                <div className="dot"></div>
              </label>

              <label className={`payment-tile ${payment === 'COD' ? 'selected' : ''}`}>
                <input type="radio" value="COD" checked={payment === "COD"} onChange={e => setPayment(e.target.value)} hidden />
                <div className="payment-brand">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
                  <span>Cash on Delivery</span>
                </div>
                <div className="dot"></div>
              </label>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: SUMMARY */}
        <div className="checkout-summary-column">
          <div className="sticky-order-summary">
            <h2 className="summary-title">Order Summary</h2>
            <div className="item-cards-list">
              {orderItems.map((item) => (
                <div key={item._id} className="mini-item-card">
                  <img src={item.imageUrl} alt={item.name} />
                  <div className="item-details">
                    <span className="name">{item.name}</span>
                    <div className="metrics">
                      <span className="qty">Qty: {item.qty}</span>
                      <span className="price">₹{item.price * item.qty}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="final-breakdown">
              <div className="row">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="row">
                <span>Delivery Charge</span>
                <span>₹50</span>
              </div>
              <div className="row grand-total">
                <span>Total Amount</span>
                <span className="price">₹{total + 50}</span>
              </div>
            </div>

            <button 
              className="complete-order-btn" 
              onClick={placeOrder} 
              disabled={loading || (needsPrescription && !prescriptionUrl)}
            >
              {loading ? "Finalizing..." : `Place Order • ₹${total + 50}`}
            </button>
            <span className="security-tag">🔒 SSL Secured Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );

}

export default Order;