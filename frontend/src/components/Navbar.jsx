import React from 'react';

export default function Navbar({ health, onOpenAddModal }) {
  const isHealthy = health?.status === 'healthy';

  return (
    <nav className="navbar">
      <div className="brand">
        <div className="brand-icon">📚</div>
        <div className="brand-text">
          <h1>BookVerse</h1>
          <span>Library & Bookstore Engine</span>
        </div>
      </div>

      <div className="nav-actions">
        <div className={`health-badge ${isHealthy ? '' : 'degraded'}`}>
          <div className="pulse-dot"></div>
          <span>
            API: {isHealthy ? 'Online (Postgres OK)' : 'Checking...'}
          </span>
        </div>

        <button className="btn btn-primary" onClick={onOpenAddModal}>
          <span>+ Add Book</span>
        </button>
      </div>
    </nav>
  );
}
