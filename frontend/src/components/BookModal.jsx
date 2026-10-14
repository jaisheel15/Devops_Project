import React, { useState, useEffect } from 'react';

export default function BookModal({ isOpen, onClose, onSubmit, editingBook }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: 'Software Engineering',
    price: '',
    stock: '',
    description: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title || '',
        author: editingBook.author || '',
        isbn: editingBook.isbn || '',
        genre: editingBook.genre || 'Software Engineering',
        price: editingBook.price !== undefined ? editingBook.price : '',
        stock: editingBook.stock !== undefined ? editingBook.stock : '',
        description: editingBook.description || '',
      });
    } else {
      setFormData({
        title: '',
        author: '',
        isbn: '',
        genre: 'Software Engineering',
        price: '',
        stock: '',
        description: '',
      });
    }
    setError('');
  }, [editingBook, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.isbn || !formData.price) {
      setError('Please fill in all required fields.');
      return;
    }

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock || 0, 10),
    };

    onSubmit(payload);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {error && (
          <div style={{ color: 'var(--accent-rose)', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Clean Code"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Author *</label>
              <input
                className="form-input"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="e.g. Robert C. Martin"
                required
              />
            </div>
            <div className="form-group">
              <label>Genre / Category *</label>
              <select
                className="form-select"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              >
                <option value="Software Engineering">Software Engineering</option>
                <option value="DevOps & Cloud">DevOps & Cloud</option>
                <option value="Databases & Distributed Systems">Databases & Distributed Systems</option>
                <option value="Security & Networks">Security & Networks</option>
                <option value="Fiction & Sci-Fi">Fiction & Sci-Fi</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>ISBN *</label>
              <input
                className="form-input"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                placeholder="e.g. 978-0132350884"
                required
              />
            </div>
            <div className="form-group">
              <label>Price ($) *</label>
              <input
                className="form-input"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="29.99"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Stock Quantity</label>
            <input
              className="form-input"
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              placeholder="10"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-textarea"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief synopsis..."
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingBook ? 'Save Changes' : 'Create Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
