import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', role: 'editor' });
  const [msg, setMsg] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const load = () => api.get('/users').then(r => setUsers(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const createUser = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/users', form);
      setForm({ username: '', password: '', role: 'editor' });
      setShowForm(false);
      load();
      setMsg('User created successfully');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed to create user');
    }
  };

  const changeRole = async (id, role) => {
    await api.put(`/users/${id}`, { role });
    load();
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user? They will lose access immediately.')) return;
    await api.delete(`/users/${id}`);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">Manage who can access and edit this CMS</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add User
        </button>
      </div>

      {msg && <div className={`alert ${msg.includes('success') ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: 20 }}>{msg}</div>}

      {/* Role explanation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {[
          { role: 'Admin', color: '#6366f1', bg: '#eef2ff', desc: 'Full access — can create, edit, delete pages and media, and manage users.' },
          { role: 'Editor', color: '#10b981', bg: '#ecfdf5', desc: 'Can create and edit pages and upload media. Cannot delete or manage users.' },
        ].map(r => (
          <div key={r.role} className="card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ width: 40, height: 40, background: r.bg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: r.color, fontWeight: 800, fontSize: 13 }}>{r.role[0]}</div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{r.role}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{r.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Add user form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 24, border: '2px solid var(--primary)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: 15 }}>New User</h3>
          <form onSubmit={createUser} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 160px auto', gap: 12, alignItems: 'end' }}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input placeholder="username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" placeholder="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="btn btn-primary">Create</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Users table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Joined</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, background: user.role === 'admin' ? '#eef2ff' : '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: user.role === 'admin' ? '#6366f1' : '#10b981', fontSize: 14 }}>
                      {user.username[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{user.username}</div>
                      {user.id === currentUser.id && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>You</div>}
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: user.role === 'admin' ? '#eef2ff' : '#ecfdf5', color: user.role === 'admin' ? '#6366f1' : '#10b981' }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    {user.id !== currentUser.id && (
                      <>
                        <button
                          onClick={() => changeRole(user.id, user.role === 'admin' ? 'editor' : 'admin')}
                          className="btn btn-secondary btn-sm"
                        >
                          Make {user.role === 'admin' ? 'Editor' : 'Admin'}
                        </button>
                        <button onClick={() => deleteUser(user.id)} className="btn btn-danger btn-sm">Remove</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
