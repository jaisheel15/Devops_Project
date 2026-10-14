import React from 'react';

export default function BookCard({ book, onEdit, onDelete }) {
  const isOutOfStock = book.stock <= 0;
  const isLowStock = book.stock > 0 && book.stock < 5;

  let stockClass = 'stock-in';
  let stockLabel = `${book.stock} in stock`;
  if (isOutOfStock) {
    stockClass = 'stock-out';
    stockLabel = 'Out of Stock';
  } else if (isLowStock) {
    stockClass = 'stock-low';
    stockLabel = `Only ${book.stock} left`;
  }

  return (
    <div className="book-card">
      <div>
        <div className="book-header">
          <span className="genre-tag">{book.genre}</span>
          <span className="book-price">${book.price.toFixed(2)}</span>
        </div>

        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author}</p>
        {book.description && (
          <p className="book-description">{book.description}</p>
        )}
      </div>

      <div>
        <div className="book-meta">
          <span className="book-isbn">ISBN: {book.isbn}</span>
          <span className={`stock-indicator ${stockClass}`}>
            ● {stockLabel}
          </span>
        </div>

        <div className="card-actions">
          <button
            className="btn btn-secondary btn-sm"
            style={{ flex: 1 }}
            onClick={() => onEdit(book)}
          >
            ✏️ Edit
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(book.id, book.title)}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
