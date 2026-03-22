import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { ToastContext } from "../context/ToastContext";
import "./order.css";

function Order() {
  const { cart, clearCart } = useContext(CartContext);
  const { showToast } = useContext(ToastContext);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("");
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [prescriptionUrl, setPrescriptionUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const total = cart.reduce((a, b) => a + b.price * b.qty, 0);

  const needsPrescription = cart.some((item) => item.requiresPrescription);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("prescription", file);

    try {
      setLoading(true);
      const res = await API.post("/upload/prescription", formData);
      setPrescriptionUrl(res.data.url);
      setPrescriptionFile(file);
      showToast("Verification document uploaded");
    } catch (err) {
      showToast("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      showToast("Your cart is empty");
      return;
    }

    if (!name || !phone || !address) {
      showToast("Please fill all delivery details");
      return;
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
        customerName: name,
        phone,
        address,
        paymentMethod: payment,
        prescriptionUrl,
        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          image: item.imageUrl || item.image || "/placeholder.png",
        })),
        total,
      });

      clearCart();
      showToast("Order placed successfully");
      navigate("/success");
    } catch (err) {
      console.log(err);
      showToast("Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="page-container animate-fade-in">
      <div className="order-page">
        <h1>Secure Checkout</h1>

        <div className="order-container">
          {/* DELIVERY DETAILS */}
          <div className="order-form">
            <h2>Delivery Details</h2>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <textarea
              placeholder="Full Delivery Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            {/* PRESCRIPTION UPLOAD */}
            {needsPrescription && (
              <div className="prescription-upload-section">
                <h3>Medical Verification Required</h3>
                <p>This order contains medicines that require a doctor's prescription.</p>
                <div className="upload-box">
                  <input
                    type="file"
                    id="pres-file"
                    onChange={handleFileUpload}
                    accept="image/*,application/pdf"
                    hidden
                  />
                  <label htmlFor="pres-file" className="upload-label">
                    {prescriptionUrl ? "✓ Document Verified" : "Upload Prescription (Image/PDF)"}
                  </label>
                  {prescriptionUrl && (
                    <div className="preview-indicator">
                      Document uploaded: {prescriptionFile?.name}
                    </div>
                  )}
                </div>
              </div>
            )}


            {/* PAYMENT METHOD */}
            <div className="payment-method">
              <h3>💳 Select Payment Method</h3>
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="UPI"
                    onChange={(e) => setPayment(e.target.value)}
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/UPI-Logo-vector.svg/512px-UPI-Logo-vector.svg.png"
                    alt="UPI"
                  />
                  <span>UPI Payment</span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="Google Pay"
                    onChange={(e) => setPayment(e.target.value)}
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png"
                    alt="Google Pay"
                  />
                  <span>Google Pay</span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="Credit Card"
                    onChange={(e) => setPayment(e.target.value)}
                  />
                  <img src="https://cdn-icons-png.flaticon.com/512/633/633611.png" alt="Card" />
                  <span>Credit Card</span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="Pay on Delivery"
                    onChange={(e) => setPayment(e.target.value)}
                  />
                  <img src="https://cdn-icons-png.flaticon.com/512/1554/1554401.png" alt="COD" />
                  <span>Cash on Delivery</span>
                </label>
              </div>
            </div>

            <button className="confirm-btn" onClick={placeOrder} disabled={loading}>
              {loading ? "Processing..." : `Complete Order • ₹${total}`}
            </button>
          </div>

          {/* ORDER SUMMARY */}
          <div className="order-summary">
            <h2>🛒 Order Summary</h2>
            {cart.map((item) => (
              <div key={item._id} className="summary-item">
                <img src={item.imageUrl || item.image || "/placeholder.png"} alt={item.name} />
                <div className="summary-item-info">
                  <p>{item.name}</p>
                  <span>Quantity: {item.qty}</span>
                </div>
                <div className="summary-item-price">₹{item.price * item.qty}</div>
              </div>
            ))}

            <div className="summary-total">
              <span>Grand Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Order;