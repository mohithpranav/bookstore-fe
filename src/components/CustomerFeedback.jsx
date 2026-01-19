import React, { useState, useEffect } from "react";
import api from "../utils/api";
import "./CustomerFeedback.css";

const CustomerFeedback = ({ bookId, reviews = [] }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [canReview, setCanReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [allReviews, setAllReviews] = useState(reviews);
  const [error, setError] = useState("");

  useEffect(() => {
    setAllReviews(reviews);
    if (bookId) {
      api
        .get(`/books/${bookId}/can-review`)
        .then((res) => setCanReview(res.data.canReview))
        .catch(() => setCanReview(false));
    }
  }, [bookId, reviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post(`/books/${bookId}/review`, {
        rating,
        comment: reviewText,
      });
      // Fetch updated book details to get new reviews
      const res = await api.get(`/books/${bookId}`);
      setAllReviews(res.data.book.comments || []);
      setRating(0);
      setReviewText("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="customer-feedback">
      <h2 className="feedback-title">Customer Feedback</h2>
      {canReview ? (
        <form onSubmit={handleSubmit} className="review-form">
          <div className="rating-section">
            <p className="rating-label">Your rating</p>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`bi ${star <= (hoverRating || rating) ? "bi-star-fill" : "bi-star"} star-icon`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                ></i>
              ))}
            </div>
          </div>
          <textarea
            className="review-textarea"
            placeholder="Write your review"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows="4"
            required
          ></textarea>
          <div className="form-actions">
            <button
              type="submit"
              className="btn-submit-review"
              disabled={submitting || !rating || !reviewText}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
          {error && (
            <div style={{ color: "#a94442", marginTop: 8 }}>{error}</div>
          )}
        </form>
      ) : (
        <div style={{ marginBottom: 24, color: "#888" }}>
          Only users who have placed and received an order for this book can
          leave a review.
        </div>
      )}
      <div className="reviews-list">
        {allReviews.length === 0 ? (
          <div style={{ color: "#888" }}>No reviews yet.</div>
        ) : (
          allReviews.map((review, idx) => (
            <div key={review._id || idx} className="review-item">
              <div className="review-header">
                <div className="reviewer-avatar">
                  {review.userId?.Name
                    ? review.userId.Name.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "U"}
                </div>
                <div className="reviewer-info">
                  <h4 className="reviewer-name">
                    {review.userId?.name || "User"}
                  </h4>
                  <div className="review-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={`bi ${star <= review.rating ? "bi-star-fill" : "bi-star"} review-star`}
                      ></i>
                    ))}
                  </div>
                </div>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomerFeedback;
