import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerFeedback from "./CustomerFeedback";
import api from "../utils/api";
import "./BookDetails.css";

const BookDetails = ({ book }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();
  const images = [book.image, book.image]; // Mock multiple images

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      await api.post("/cart", {
        productId: book._id,
        quantity: 1,
      });
      alert("Book added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <div className="book-details-left">
        <div className="book-image-section">
          <div className="book-thumbnails">
            {images.map((img, index) => (
              <div
                key={index}
                className={`thumbnail ${selectedImage === index ? "active" : ""}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={img} alt={`${book.name} ${index + 1}`} />
              </div>
            ))}
          </div>
          <div className="book-image-main">
            <img src={images[selectedImage]} alt={book.name} />
          </div>
        </div>
        <div className="book-actions">
          <button 
            className="btn-add-to-bag" 
            onClick={handleAddToCart}
            disabled={adding}
          >
            {adding ? "ADDING..." : "ADD TO BAG"}
          </button>
          <button className="btn-wishlist">
            <i className="bi bi-heart"></i> WISHLIST
          </button>
        </div>
      </div>

      <div className="book-details-right">
        <h1 className="book-details-title">{book.name}</h1>
        <p className="book-details-author">by {book.author}</p>

        <div className="book-details-rating">
          <span className="rating-badge">{book.rating || 4.5} ★</span>
          <span className="rating-count">({book.ratingCount || 20})</span>
        </div>

        <div className="book-details-price">
          <span className="current-price">Rs.{book.price}</span>
          {book.originalPrice && (
            <span className="original-price">
              Rs.{book.originalPrice || 2000}
            </span>
          )}
        </div>

        <div className="book-detail-section">
          <h3>▸ Book Detail</h3>
          <p className="book-description">
            {book.details ||
              "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut"}
          </p>
        </div>

        <CustomerFeedback bookId={book._id} reviews={book.comments || []} />
      </div>
    </>
  );
};

export default BookDetails;
