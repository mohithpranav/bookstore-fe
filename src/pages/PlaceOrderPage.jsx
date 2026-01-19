import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./PlaceOrderPage.css";

const PlaceOrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/order/${orderId}`);
      setOrder(response.data.order);
    } catch (error) {
      console.error("Error fetching order:", error);
      alert("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      await api.put(`/order/${orderId}/confirm`);
      console.log("Order placed");
      alert("Order placed successfully!");
      navigate("/books");
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="error-container">
        <p>Order not found</p>
      </div>
    );
  }

  const totalPrice = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="place-order-page">
      <div className="place-order-container">
        <div className="breadcrumb">
          <span onClick={() => navigate("/books")} className="breadcrumb-link">
            Home
          </span>
          <span className="breadcrumb-separator">/</span>
          <span onClick={() => navigate("/cart")} className="breadcrumb-link">
            My cart
          </span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Order summary</span>
        </div>

        <h2 className="page-title">Order Summary</h2>

        {/* Order Items */}
        <div className="order-items-section">
          <h3>Order Items</h3>
          {order.items.map((item, index) => (
            <div key={index} className="order-item">
              <div className="item-image">
                <img src={item.itemId?.image || "/placeholder.jpg"} alt={item.itemId?.name || "Book"} />
              </div>
              <div className="item-info">
                <h4>{item.itemId?.name || "Unknown Book"}</h4>
                <p className="item-author">by {item.itemId?.author || "Unknown"}</p>
                <p className="item-quantity">Quantity: {item.quantity}</p>
                <p className="item-price">Rs. {item.price}</p>
              </div>
              <div className="item-total">
                <p className="total-label">Total</p>
                <p className="total-price">Rs. {item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery Address */}
        <div className="delivery-address-section">
          <h3>Delivery Address</h3>
          {order.addressId && (
            <div className="address-card">
              <p className="address-name">{order.addressId.fullName}</p>
              <p className="address-details">
                {order.addressId.street}, {order.addressId.city}
              </p>
              <p className="address-details">
                {order.addressId.state} - {order.addressId.pincode}
              </p>
              <p className="address-mobile">Mobile: {order.addressId.mobileNo}</p>
              <span className="address-type-badge">{order.addressId.type}</span>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="order-summary-section">
          <h3>Order Details</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>Rs. {totalPrice}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-row total-row">
            <span>Total</span>
            <span>Rs. {totalPrice}</span>
          </div>

          <div className="order-status">
            <p>Status: <span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span></p>
          </div>

          <button className="btn-place-order" onClick={handlePlaceOrder}>
            PLACE ORDER
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
