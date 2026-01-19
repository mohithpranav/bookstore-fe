import React, { useState, useEffect } from "react";
import BookCard from "../components/BookCard";
import Pagination from "../components/Pagination";
import api from "../utils/api";
import "./BooksPage.css";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBooks(currentPage);
  }, [currentPage]);

  const fetchBooks = async (page) => {
    try {
      setLoading(true);
      const response = await api.get(`/books?page=${page}`);
      const data = response.data;

      setBooks(data.books || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching books:", error);
      // Mock data for demo
      setBooks(generateMockBooks());
      setTotalPages(18);
    } finally {
      setLoading(false);
    }
  };

  const generateMockBooks = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: "Don't Make Me Think",
      author: "Steve Krug",
      price: 1500,
      originalPrice: 2000,
      rating: 4.5,
      ratingCount: 20,
      image: `https://source.unsplash.com/150x200/?book,${i}`,
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  return (
    <div className="books-container">
      <div className="books-grid">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default BooksPage;
