import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BookDetails from "../components/BookDetails";
import api from "../utils/api";
import "./BookDetailsPage.css";

const BookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/books/${id}`);
      setBook(response.data.book);
    } catch (error) {
      console.error("Error fetching book details:", error);
      // Mock data for demo
      setBook({
        id: id,
        name: "Don't Make Me Think",
        author: "Steve Krug",
        price: 1500,
        originalPrice: 2000,
        rating: 4.5,
        ratingCount: 20,
        image: "https://source.unsplash.com/400x600/?book,design",
        details:
          "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut",
      });
    } finally {
      setLoading(false);
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

  if (!book) {
    return (
      <div className="error-container">
        <h2>Book not found</h2>
        <button onClick={() => navigate("/books")} className="btn btn-primary">
          Back to Books
        </button>
      </div>
    );
  }

  return (
    <div className="book-details-page">
      <div className="breadcrumb">
        <span onClick={() => navigate("/books")} className="breadcrumb-link">
          Home
        </span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{book?.name}</span>
      </div>

      <div className="book-details-layout">
        <BookDetails book={book} />
      </div>
    </div>
  );
};

export default BookDetailsPage;
