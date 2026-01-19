import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import "./OrderPage.css";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/orders")
      .then((res) => {
        setOrders(res.data.orders || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="order-page">
      <h2 className="order-title">My Orders</h2>
      {loading ? (
        <div>Loading...</div>
      ) : orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.itemId._id} className="order-book">
                  <img
                    src={item.itemId.image}
                    alt={item.itemId.name}
                    className="order-book-img"
                  />
                  <div className="order-book-info">
                    <div className="order-book-title">{item.itemId.name}</div>
                    <div className="order-book-author">
                      by {item.itemId.author}
                    </div>
                    <div className="order-book-price">Rs.{item.price}</div>
                    {item.itemId.originalPrice && (
                      <span className="order-book-original">
                        Rs.{item.itemId.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="order-meta">
              <span className="order-status">{order.status}</span>
              <span className="order-date">
                Order Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "2-digit",
                })}
              </span>
              <span className="order-total">Total: Rs.{order.totalPrice}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderPage;
