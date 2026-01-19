import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./CartPage.css";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const [customerDetails, setCustomerDetails] = useState({
    fullName: "",
    mobileNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    type: "HOME",
  });

  useEffect(() => {
    fetchCartItems();
    fetchAddresses();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await api.get("/cart");
      const items = response.data.items.map((item) => ({
        id: item.itemId._id,
        name: item.itemId.name,
        author: item.itemId.author,
        price: item.itemId.price,
        quantity: item.quantity,
        image: item.itemId.image,
      }));
      setCartItems(items);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await api.get("/address");
      setAddresses(response.data.addresses || []);
      if (response.data.addresses && response.data.addresses.length > 0) {
        setSelectedAddressId(response.data.addresses[0]._id);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await api.put("/cart", { itemId, quantity: newQuantity });
      setCartItems(
        cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item,
        ),
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);
      setCartItems(cartItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleContinue = async () => {
    // Validate address fields
    if (
      !customerDetails.fullName ||
      !customerDetails.mobileNumber ||
      !customerDetails.address ||
      !customerDetails.city ||
      !customerDetails.state ||
      !customerDetails.pincode
    ) {
      alert("Please fill in all address fields");
      return;
    }

    try {
      const response = await api.post("/address", {
        fullName: customerDetails.fullName,
        mobileNo: customerDetails.mobileNumber,
        street: customerDetails.address,
        city: customerDetails.city,
        state: customerDetails.state,
        pincode: customerDetails.pincode,
        type: customerDetails.type,
      });

      if (response.data.success) {
        // Refresh addresses and select the new one
        await fetchAddresses();
        setSelectedAddressId(response.data.newAddress._id);

        // Clear the form
        setCustomerDetails({
          fullName: "",
          mobileNumber: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          type: "HOME",
        });

        alert("Address added successfully!");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      alert("Failed to add address. Please try again.");
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      alert("Please select a delivery address");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    // Calculate frontend total
    const frontendTotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    try {
      const response = await api.post("/order", {
        addressId: selectedAddressId,
        expectedTotal: frontendTotal,
      });

      if (response.data.order) {
        // Navigate to place order page with order ID
        navigate(`/place-order/${response.data.order._id}`);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="cart-page">
      {loading ? (
        <div className="loading-container">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="cart-container">
          <div className="breadcrumb">
            <span
              onClick={() => navigate("/books")}
              className="breadcrumb-link"
            >
              Home
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">My cart</span>
          </div>

          {/* Cart Items Section */}
          <div className="cart-items-section">
            <div className="cart-header">
              <h2>My cart ({cartItems.length})</h2>
              <div className="location-selector">
                <i className="bi bi-geo-alt-fill"></i>
                <select
                  value={selectedAddressId}
                  onChange={(e) => setSelectedAddressId(e.target.value)}
                  className="address-dropdown"
                >
                  <option value="">Use current location</option>
                  {addresses.map((address) => (
                    <option key={address._id} value={address._id}>
                      {address.fullName} - {address.street}, {address.city},{" "}
                      {address.state} - {address.pincode}
                    </option>
                  ))}
                </select>
                <i className="bi bi-chevron-down"></i>
              </div>
            </div>

            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-author">by {item.author}</p>
                    <div className="item-price">
                      <span className="current-price">Rs. {item.price}</span>
                      <span className="original-price">
                        Rs.{item.originalPrice}
                      </span>
                    </div>
                    <div className="item-actions">
                      <div className="quantity-controls">
                        <button
                          className="qty-btn"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              item.id,
                              parseInt(e.target.value) || 1,
                            )
                          }
                          className="qty-input"
                        />
                        <button
                          className="qty-btn"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="btn-remove"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Details Section */}
          <div className="customer-details-section">
            <div className="customer-details-header">
              <h3>Customer Details</h3>
              <button
                className="btn-add-address-cart"
                onClick={() => navigate("/profile")}
              >
                Add New Address
              </button>
            </div>

            <div className="info-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={customerDetails.fullName}
                  onChange={(e) =>
                    setCustomerDetails({
                      ...customerDetails,
                      fullName: e.target.value,
                    })
                  }
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  value={customerDetails.mobileNumber}
                  onChange={(e) =>
                    setCustomerDetails({
                      ...customerDetails,
                      mobileNumber: e.target.value,
                    })
                  }
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                value={customerDetails.address}
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    address: e.target.value,
                  })
                }
                className="form-control"
                rows="3"
              />
            </div>

            <div className="address-row">
              <div className="form-group">
                <label>city/town</label>
                <input
                  type="text"
                  value={customerDetails.city}
                  onChange={(e) =>
                    setCustomerDetails({
                      ...customerDetails,
                      city: e.target.value,
                    })
                  }
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  value={customerDetails.state}
                  onChange={(e) =>
                    setCustomerDetails({
                      ...customerDetails,
                      state: e.target.value,
                    })
                  }
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Pincode</label>
              <input
                type="text"
                value={customerDetails.pincode}
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    pincode: e.target.value,
                  })
                }
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="address-type"
                    checked={customerDetails.type === "HOME"}
                    onChange={() =>
                      setCustomerDetails({ ...customerDetails, type: "HOME" })
                    }
                  />
                  <span>Home</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="address-type"
                    checked={customerDetails.type === "WORK"}
                    onChange={() =>
                      setCustomerDetails({ ...customerDetails, type: "WORK" })
                    }
                  />
                  <span>Work</span>
                </label>
              </div>
            </div>

            <button className="btn-continue" onClick={handleContinue}>
              CONTINUE
            </button>
          </div>

          {/* Order Summary Section */}
          <div className="order-summary-section">
            <h3>Order summary</h3>
            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item.id} className="summary-item">
                  <div className="summary-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="summary-details">
                    <h4>{item.name}</h4>
                    <p className="summary-author">by {item.author}</p>
                    <div className="summary-price">
                      <span className="current-price">Rs. {item.price}</span>
                      <span className="quantity-info"> x {item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <span className="total-label">Total:</span>
              <span className="total-amount">Rs. {totalPrice}</span>
            </div>
            <button className="btn-checkout" onClick={handleCheckout}>
              CHECKOUT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
