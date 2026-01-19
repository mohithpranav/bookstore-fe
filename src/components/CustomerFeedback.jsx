import React, { useState } from "react";
import "./CustomerFeedback.css";

const CustomerFeedback = ({ reviews = [] }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Rating:", rating, "Review:", reviewText);
    // Add API call here
    setRating(0);
    setReviewText("");
  };

  const mockReviews =
    reviews.length > 0
      ? reviews
      : [
          {
            id: 1,
            name: "Aniket Chile",
            initials: "AC",
            rating: 3,
            comment:
              "Good product. Even though the translation could have been better, Chanakya's neeti are thought provoking. Chanakya has written on many different topics and his writings are succinct.",
          },
          {
            id: 2,
            name: "Shweta Bodkar",
            initials: "SB",
            rating: 4,
            comment:
              "Good product. Even though the translation could have been better, Chanakya's neeti are thought provoking. Chanakya has written on many different topics and his writings are succinct.",
          },
        ];

  return (
    <div className="customer-feedback">
      <h2 className="feedback-title">Customer Feedback</h2>

      <div className="rating-section">
        <p className="rating-label">Overall rating</p>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <i
              key={star}
              className={`bi ${
                star <= (hoverRating || rating) ? "bi-star-fill" : "bi-star"
              } star-icon`}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            ></i>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="review-form">
        <textarea
          className="review-textarea"
          placeholder="Write your review"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows="4"
        ></textarea>
        <div className="form-actions">
          <button type="submit" className="btn-submit-review">
            Submit
          </button>
        </div>
      </form>

      <div className="reviews-list">
        {mockReviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <div className="reviewer-avatar">{review.initials}</div>
              <div className="reviewer-info">
                <h4 className="reviewer-name">{review.name}</h4>
                <div className="review-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`bi ${
                        star <= review.rating ? "bi-star-fill" : "bi-star"
                      } review-star`}
                    ></i>
                  ))}
                </div>
              </div>
            </div>
            <p className="review-comment">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerFeedback;
