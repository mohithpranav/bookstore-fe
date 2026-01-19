import React from "react";
import { useNavigate } from "react-router-dom";
import "./BookCard.css";

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/books/${book.id}`);
  };

  return (
    <div className="book-card" onClick={handleClick}>
      <div className="book-image-container">
        <img
          src={book.image || "https://via.placeholder.com/150x200?text=Book"}
          alt={book.name}
          className="book-image"
        />
      </div>
      <div className="book-info">
        <h3 className="book-title">{book.name}</h3>
        <p className="book-author">by {book.author}</p>
        <div className="book-rating">
          <span className="rating-badge">{book.rating || 4.5} ★</span>
          <span className="rating-count">({book.ratingCount || 20})</span>
        </div>
        <div className="book-price">
          <span className="current-price">Rs. {book.price}</span>
          {book.originalPrice && (
            <span className="original-price">Rs. {book.originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
