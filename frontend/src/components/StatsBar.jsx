import React from 'react';

export default function StatsBar({ books }) {
  const totalTitles = books.length;
  const totalStock = books.reduce((acc, b) => acc + (b.stock || 0), 0);
  const uniqueGenres = new Set(books.map((b) => b.genre)).size;
  const lowStockCount = books.filter((b) => b.stock < 5).length;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
          📖
        </div>
        <div className="stat-info">
          <div className="stat-value">{totalTitles}</div>
          <div className="stat-label">Unique Titles</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
          📦
        </div>
        <div className="stat-info">
          <div className="stat-value">{totalStock}</div>
          <div className="stat-label">Total Inventory Stock</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}>
          🏷️
        </div>
        <div className="stat-info">
          <div className="stat-value">{uniqueGenres}</div>
          <div className="stat-label">Active Categories</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
          ⚠️
        </div>
        <div className="stat-info">
          <div className="stat-value">{lowStockCount}</div>
          <div className="stat-label">Low Stock Alerts (&lt;5)</div>
        </div>
      </div>
    </div>
  );
}
