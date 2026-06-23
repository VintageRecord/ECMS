import React, { useEffect, useRef, useState } from 'react';
import api from '../api';

export default function Media() {
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const load = () => api.get('/media').then(r => setMedia(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const doUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('/media/upload', formData);
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Upload failed. Only images are allowed.');
    }
    setUploading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    doUpload(e.dataTransfer.files[0]);
  };

  const deleteMedia = async (id) => {
    if (!confirm('Delete this file?')) return;
    await api.delete(`/media/${id}`);
    setSelected(null);
    load();
  };

  const filtered = media.filter(m => m.original_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Media Library</h1>
          <p className="page-subtitle">{media.length} file{media.length !== 1 ? 's' : ''} uploaded</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => doUpload(e.target.files[0])} />
          <button className="btn btn-primary" onClick={() => fileRef.current.click()} disabled={uploading}>
            {uploading ? (
              <>Uploading...</>
            ) : (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>Upload Image</>
            )}
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 320, marginBottom: 20 }}>
        <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input placeholder="Search files..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileRef.current.click()}
        style={{
          border: `2px dashed ${dragOver ? 'var(--primary)' : 'var(--border)'}`,
          borderRadius: 12, padding: '24px', textAlign: 'center', marginBottom: 20,
          background: dragOver ? 'var(--primary-light)' : 'var(--surface)',
          cursor: 'pointer', transition: 'all 0.2s',
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 8 }}>{uploading ? '⏳' : '📤'}</div>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          {uploading ? 'Uploading...' : 'Drop image here or click to upload'}
        </p>
        <p style={{ color: '#94a3b8', fontSize: 11, marginTop: 4 }}>PNG, JPG, GIF, WebP, SVG up to 10MB</p>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🖼️</div>
          <h3>{search ? 'No files match your search' : 'No media uploaded yet'}</h3>
          <p>{search ? 'Try a different search term' : 'Upload your first image to get started'}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
          {filtered.map(item => (
            <div
              key={item.id}
              onClick={() => setSelected(item)}
              style={{
                background: 'var(--surface)',
                border: `2px solid ${selected?.id === item.id ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
                transition: 'all 0.15s', boxShadow: selected?.id === item.id ? '0 0 0 3px rgba(99,102,241,0.12)' : 'none',
              }}
            >
              <div style={{ height: 140, overflow: 'hidden', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={item.url} alt={item.original_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px' }}>
                <p style={{ fontSize: 12, color: 'var(--text)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.original_name}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{(item.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}
          onClick={() => setSelected(null)}
        >
          <div
            className="card"
            style={{ maxWidth: 520, width: '90%', maxHeight: '90vh', overflow: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 15 }}>File Details</h3>
              <button onClick={() => setSelected(null)} className="btn btn-ghost btn-sm" style={{ fontSize: 18, padding: '2px 8px' }}>×</button>
            </div>
            <img src={selected.url} alt={selected.original_name} style={{ width: '100%', borderRadius: 10, marginBottom: 16, border: '1px solid var(--border)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {[
                { label: 'Filename', value: selected.original_name },
                { label: 'Size', value: `${(selected.size / 1024).toFixed(1)} KB` },
                { label: 'Type', value: selected.mimetype },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, width: 70, flexShrink: 0 }}>{row.label}</span>
                  <span style={{ fontSize: 12, color: 'var(--text)' }}>{row.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, width: 70, flexShrink: 0 }}>URL</span>
                <code style={{ fontSize: 11, background: 'var(--bg)', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)', wordBreak: 'break-all', flex: 1 }}>{selected.url}</code>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { navigator.clipboard.writeText(window.location.origin + selected.url); alert('URL copied to clipboard!'); }} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                📋 Copy URL
              </button>
              <button onClick={() => deleteMedia(selected.id)} className="btn btn-danger" style={{ flex: 1, justifyContent: 'center' }}>
                🗑 Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
