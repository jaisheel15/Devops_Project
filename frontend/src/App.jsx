import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatsBar from './components/StatsBar';
import BookCard from './components/BookCard';
import BookModal from './components/BookModal';
import { getBooks, createBook, updateBook, deleteBook, fetchHealth } from './api';

const SAMPLE_BOOKS = [
  {
    title: 'The Phoenix Project',
    author: 'Gene Kim, Kevin Behr, George Spafford',
    isbn: '978-1942788294',
    genre: 'DevOps & Cloud',
    price: 24.99,
    stock: 14,
    description: 'A novel about IT, DevOps, and helping your business win.',
  },
  {
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    isbn: '978-1449373320',
    genre: 'Databases & Distributed Systems',
    price: 49.99,
    stock: 9,
    description: 'The big ideas behind reliable, scalable, and maintainable systems.',
  },
  {
    title: 'Site Reliability Engineering',
    author: 'Betsy Beyer, Chris Jones, Jennifer Petoff',
    isbn: '978-1491929124',
    genre: 'DevOps & Cloud',
    price: 44.95,
    stock: 3,
    description: 'How Google runs production systems with high reliability.',
  },
  {
    title: 'Clean Code: A Handbook of Agile Craftsmanship',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    genre: 'Software Engineering',
    price: 38.50,
    stock: 22,
    description: 'Even bad code can function, but poorly crafted code can bring a development organization to its knees.',
  },
  {
    title: 'Kubernetes in Action',
    author: 'Marko Luksa',
    isbn: '978-1617293726',
    genre: 'DevOps & Cloud',
    price: 49.99,
    stock: 6,
    description: 'Comprehensive guide to container orchestration with Kubernetes.',
  },
];

export default function App() {
  const [books, setBooks] = useState([]);
  const [health, setHealth] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const loadHealth = async () => {
    const data = await fetchHealth();
    setHealth(data);
  };

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await getBooks(searchTerm, selectedGenre);
      setBooks(data);
    } catch (err) {
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHealth();
    const interval = setInterval(loadHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadBooks();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedGenre]);

  const handleOpenAddModal = () => {
    setEditingBook(null);
    setModalOpen(true);
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (editingBook) {
        const updated = await updateBook(editingBook.id, formData);
        showNotification(`Updated "${updated.title}" successfully!`);
      } else {
        const created = await createBook(formData);
        showNotification(`Created "${created.title}" successfully!`);
      }
      setModalOpen(false);
      loadBooks();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteBook = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteBook(id);
        showNotification(`Deleted "${title}" from catalog.`);
        loadBooks();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleSeedSamples = async () => {
    try {
      for (const sample of SAMPLE_BOOKS) {
        await createBook(sample).catch(() => {});
      }
      showNotification('Sample library catalog seeded!');
      loadBooks();
    } catch (err) {
      alert(`Seeding failed: ${err.message}`);
    }
  };

  return (
    <div className="container">
      <Navbar health={health} onOpenAddModal={handleOpenAddModal} />

      {notification && (
        <div
          style={{
            background: notification.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
            border: `1px solid ${notification.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
            color: notification.type === 'success' ? '#34d399' : '#fb7185',
            padding: '0.75rem 1.25rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{notification.msg}</span>
          <button
            onClick={() => setNotification(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      <StatsBar books={books} />

      <div className="controls-bar">
        <div className="search-box">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search catalog by title, author, or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              ✕
            </button>
          )}
        </div>

        <select
          className="filter-select"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">All Genres</option>
          <option value="Software Engineering">Software Engineering</option>
          <option value="DevOps & Cloud">DevOps & Cloud</option>
          <option value="Databases & Distributed Systems">Databases & Distributed Systems</option>
          <option value="Security & Networks">Security & Networks</option>
          <option value="Fiction & Sci-Fi">Fiction & Sci-Fi</option>
        </select>

        <button className="btn btn-secondary" onClick={handleSeedSamples}>
          ⚡ Seed Sample Books
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          Loading book catalog...
        </div>
      ) : books.length === 0 ? (
        <div className="empty-state">
          <h3>No books found</h3>
          <p>
            {searchTerm || selectedGenre
              ? 'No titles match your current search and filter criteria.'
              : 'Your library catalog is currently empty.'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={handleOpenAddModal}>
              + Add First Book
            </button>
            <button className="btn btn-secondary" onClick={handleSeedSamples}>
              ⚡ Populate Sample Catalog
            </button>
          </div>
        </div>
      ) : (
        <div className="book-grid">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onEdit={handleEditBook}
              onDelete={handleDeleteBook}
            />
          ))}
        </div>
      )}

      <BookModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        editingBook={editingBook}
      />
    </div>
  );
}
