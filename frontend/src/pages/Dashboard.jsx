import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState({ pages: 0, media: 0, published: 0 });

  useEffect(() => {
    Promise.all([api.get('/pages'), api.get('/media')]).then(([pages, media]) => {
      setStats({
        pages: pages.data.length,
        media: media.data.length,
        published: pages.data.filter(p => p.status === 'published').length
      });
    }).catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Pages', value: stats.pages, color: '#4f46e5', link: '/pages' },
    { label: 'Published', value: stats.published, color: '#22c55e', link: '/pages' },
    { label: 'Media Files', value: stats.media, color: '#f59e0b', link: '/media' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Dashboard</h1>
        <Link to="/pages/new" className="btn btn-primary">+ New Page</Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {cards.map(card => (
          <Link to={card.link} key={card.label} className="card" style={{ textDecoration: 'none' }}>
            <p style={{ color: '#6b7280', fontSize: 13 }}>{card.label}</p>
            <p style={{ fontSize: 36, fontWeight: 700, color: card.color }}>{card.value}</p>
          </Link>
        ))}
      </div>
      <div className="card">
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/pages/new" className="btn btn-primary">Create New Page</Link>
          <Link to="/media" className="btn btn-secondary">Upload Media</Link>
          <Link to="/pages" className="btn btn-secondary">Manage Pages</Link>
        </div>
      </div>
    </div>
  );
}
