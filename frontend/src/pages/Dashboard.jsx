import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const PageIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const CheckIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>;
const EditIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const ImageIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
const PlusIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const UploadIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const LinkIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
const FooterIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="17" x2="21" y2="17"/></svg>;
const BulbIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>;

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

  const statCards = [
    { label: 'Total Pages', value: stats.pages, Icon: PageIcon, color: '#6366f1', bg: '#eef2ff', link: '/pages' },
    { label: 'Published', value: stats.published, Icon: CheckIcon, color: '#10b981', bg: '#ecfdf5', link: '/pages' },
    { label: 'Drafts', value: stats.draft, Icon: EditIcon, color: '#f59e0b', bg: '#fffbeb', link: '/pages' },
    { label: 'Media Files', value: stats.media, Icon: ImageIcon, color: '#8b5cf6', bg: '#f5f3ff', link: '/media' },
  ];

  const quickActions = [
    { label: 'Create New Page', to: '/pages/new', Icon: PlusIcon },
    { label: 'Upload Media', to: '/media', Icon: UploadIcon },
    { label: 'Edit Navigation', to: '/settings', Icon: LinkIcon },
    { label: 'Edit Footer', to: '/settings', Icon: FooterIcon },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px' }}>
          {greeting}, {user.username}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
          Here's what's happening with your website today.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {statCards.map(({ label, value, Icon, color, bg, link }) => (
          <Link to={link} key={label} className="stat-card">
            <div style={{ marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, background: bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                <Icon />
              </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color, letterSpacing: '-1px', lineHeight: 1 }}>{value}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6, fontWeight: 500 }}>{label}</div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
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
              <div className="empty-state-icon" style={{ color: 'var(--text-muted)' }}><PageIcon /></div>
              <h3>No pages yet</h3>
              <p>Create your first page to get started</p>
              <Link to="/pages/new" className="btn btn-primary">Create a Page</Link>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th><th>Slug</th><th>Status</th><th>Updated</th><th></th>
                </tr>
              </thead>
              <tbody>
                {recentPages.map(page => (
                  <tr key={page.id}>
                    <td style={{ fontWeight: 600 }}>{page.title}</td>
                    <td style={{ color: 'var(--text-muted)' }}>/{page.slug}</td>
                    <td><span className={`badge badge-${page.status}`}>{page.status}</span></td>
                    <td style={{ color: 'var(--text-muted)' }}>{new Date(page.updated_at).toLocaleDateString()}</td>
                    <td><Link to={`/pages/edit/${page.id}`} className="btn btn-ghost btn-sm">Edit</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {quickActions.map(({ label, to, Icon }) => (
                <Link key={label} to={to} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                  borderRadius: 8, border: '1px solid var(--border)', color: 'var(--text)',
                  fontSize: 13, fontWeight: 500, transition: 'all 0.15s', background: 'var(--bg)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'var(--primary-light)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg)'; }}
                >
                  <span style={{ color: 'var(--primary)' }}><Icon /></span> {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <BulbIcon /> Tips
            </h3>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
              Use <strong style={{ color: 'white' }}>Save & Preview</strong> in the page editor to see your changes with navigation and footer before publishing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
