import React, { useEffect, useRef, useState } from 'react';
import api from '../api';

export default function Media() {
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState(null);
  const fileRef = useRef();

  const load = () => api.get('/media').then(r => setMedia(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('/media/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Upload failed');
    }
    setUploading(false);
  };

  const deleteMedia = async (id) => {
    if (!confirm('Delete this file?')) return;
    await api.delete(`/media/${id}`);
    setSelected(null);
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Media Library</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={upload} />
          <button className="btn btn-primary" onClick={() => fileRef.current.click()} disabled={uploading}>
            {uploading ? 'Uploading...' : '+ Upload Image'}
          </button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
        {media.map(item => (
          <div key={item.id} onClick={() => setSelected(item)} className="card" style={{ padding: 8, cursor: 'pointer', border: selected?.id === item.id ? '2px solid #4f46e5' : '2px solid transparent' }}>
            <img src={item.url} alt={item.original_name} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 4 }} />
            <p style={{ fontSize: 11, color: '#6b7280', marginTop: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.original_name}</p>
          </div>
        ))}
        {media.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
            No media uploaded yet. Click "Upload Image" to get started.
          </div>
        )}
      </div>

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setSelected(null)}>
          <div className="card" style={{ maxWidth: 500, width: '90%' }} onClick={e => e.stopPropagation()}>
            <img src={selected.url} alt={selected.original_name} style={{ width: '100%', borderRadius: 6, marginBottom: 16 }} />
            <p style={{ fontWeight: 600, marginBottom: 4 }}>{selected.original_name}</p>
            <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>URL: <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>{selected.url}</code></p>
            <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 16 }}>Size: {(selected.size / 1024).toFixed(1)} KB</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { navigator.clipboard.writeText(window.location.origin + selected.url); alert('URL Copied!'); }} className="btn btn-secondary">Copy URL</button>
              <button onClick={() => deleteMedia(selected.id)} className="btn btn-danger">Delete</button>
              <button onClick={() => setSelected(null)} className="btn btn-secondary" style={{ marginLeft: 'auto' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
