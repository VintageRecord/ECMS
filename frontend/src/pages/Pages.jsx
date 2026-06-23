import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Pages() {
  const [pages, setPages] = useState([]);

  const load = () => api.get('/pages').then(r => setPages(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const deletePage = async (id) => {
    if (!confirm('Delete this page?')) return;
    await api.delete(`/pages/${id}`);
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Pages</h1>
        <Link to="/pages/new" className="btn btn-primary">+ New Page</Link>
      </div>
      <div className="card">
        {pages.length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px 0' }}>No pages yet. <Link to="/pages/new" style={{ color: '#4f46e5' }}>Create your first page</Link></p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                {['Title', 'Slug', 'Status', 'Updated', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 13, color: '#6b7280', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pages.map(page => (
                <tr key={page.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px' }}><strong>{page.title}</strong></td>
                  <td style={{ padding: '12px', color: '#6b7280', fontSize: 13 }}>/{page.slug}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, background: page.status === 'published' ? '#dcfce7' : '#fef3c7', color: page.status === 'published' ? '#15803d' : '#92400e' }}>
                      {page.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: '#6b7280', fontSize: 13 }}>{new Date(page.updated_at).toLocaleDateString()}</td>
                  <td style={{ padding: '12px', display: 'flex', gap: 8 }}>
                    <Link to={`/pages/edit/${page.id}`} className="btn btn-secondary" style={{ fontSize: 12, padding: '5px 10px' }}>Edit</Link>
                    <button onClick={() => deletePage(page.id)} className="btn btn-danger" style={{ fontSize: 12, padding: '5px 10px' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
