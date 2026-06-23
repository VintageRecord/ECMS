import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState({ pages: 0, media: 0, published: 0, draft: 0 });
  const [recentPages, setRecentPages] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    Promise.all([api.get('/pages'), api.get('/media')]).then(([pages, media]) => {
      const published = pages.data.filter(p => p.status === 'published').length;
      setStats({ pages: pages.data.length, media: media.data.length, published, draft: pages.data.length - published });
      setRecentPages(pages.data.slice(0, 5));
    }).catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px' }}>
          {greeting}, {user.username} 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
          Here's what's happening with your website today.
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total Pages', value: stats.pages, icon: '📄', color: '#6366f1', bg: '#eef2ff', link: '/pages' },
          { label: 'Published', value: stats.published, icon: '✅', color: '#10b981', bg: '#ecfdf5', link: '/pages' },
          { label: 'Drafts', value: stats.draft, icon: '✏️', color: '#f59e0b', bg: '#fffbeb', link: '/pages' },
          { label: 'Media Files', value: stats.media, icon: '🖼️', color: '#8b5cf6', bg: '#f5f3ff', link: '/media' },
        ].map(card => (
          <Link to={card.link} key={card.label} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, background: card.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                {card.icon}
              </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: card.color, letterSpacing: '-1px', lineHeight: 1 }}>{card.value}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6, fontWeight: 500 }}>{card.label}</div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        {/* Recent pages */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700 }}>Recent Pages</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>Your latest content</p>
            </div>
            <Link to="/pages/new" className="btn btn-primary btn-sm">+ New Page</Link>
          </div>
          {recentPages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📄</div>
              <h3>No pages yet</h3>
              <p>Create your first page to get started</p>
              <Link to="/pages/new" className="btn btn-primary">Create a Page</Link>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentPages.map(page => (
                  <tr key={page.id}>
                    <td style={{ fontWeight: 600 }}>{page.title}</td>
                    <td style={{ color: 'var(--text-muted)' }}>/{page.slug}</td>
                    <td><span className={`badge badge-${page.status}`}>{page.status}</span></td>
                    <td style={{ color: 'var(--text-muted)' }}>{new Date(page.updated_at).toLocaleDateString()}</td>
                    <td><Link to={`/pages/edit/${page.id}`} className="btn btn-ghost btn-sm">Edit →</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Create New Page', to: '/pages/new', icon: '➕' },
                { label: 'Upload Media', to: '/media', icon: '📤' },
                { label: 'Edit Navigation', to: '/settings', icon: '🔗' },
                { label: 'Edit Footer', to: '/settings', icon: '📋' },
              ].map(action => (
                <Link key={action.label} to={action.to} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                  borderRadius: 8, border: '1px solid var(--border)', color: 'var(--text)',
                  fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
                  background: 'var(--bg)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'var(--primary-light)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg)'; }}
                >
                  <span>{action.icon}</span> {action.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 8 }}>💡 Tips</h3>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
              Use <strong style={{ color: 'white' }}>Save & Preview</strong> in the page editor to see your changes with navigation and footer before publishing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
