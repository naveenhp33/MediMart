import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import "./invoice.css";

function Invoice() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    API.get(`/orders`).then((res) => {
      const found = res.data.find((o) => o._id === id);
      setOrder(found);
    });
  }, [id]);

  if (!order) return <div className="loading-spinner"></div>;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="invoice-wrapper">
      <div className="invoice-actions no-print">
        <button onClick={handlePrint} className="print-btn">
          🖨️ Print Invoice
        </button>
      </div>

      <div className="invoice-card">
        <div className="invoice-header">
          <div className="brand">
            <h1>MediMart</h1>
            <p>Certified E-Pharmacy</p>
          </div>
          <div className="invoice-meta">
            <h2>INVOICE</h2>
            <p>ID: #{order._id.slice(-8).toUpperCase()}</p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <hr />

        <div className="invoice-billing">
          <div className="bill-to">
            <h3>Bill To:</h3>
            <strong>{order.customerName}</strong>
            <p>{order.address}</p>
            <p>Phone: {order.phone}</p>
          </div>
          <div className="ship-from">
            <h3>From:</h3>
            <strong>MediMart Healthcare</strong>
            <p>123 Medical Plaza, Health City</p>
            <p>GSTIN: 29AAAAA0000A1Z5</p>
          </div>
        </div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>₹{item.price}</td>
                <td>₹{item.qty * item.price}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3">Total Amount</td>
              <td className="total-cell">₹{order.total}</td>
            </tr>
          </tfoot>
        </table>

        <div className="invoice-footer">
          <p>Payment Method: {order.paymentMethod.toUpperCase()}</p>
          <p className="note">This is a computer-generated invoice and requires no signature.</p>
          <div className="medical-disclaimer">
            * Medicines sold are non-returnable. Please consult a doctor before use.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Invoice;
