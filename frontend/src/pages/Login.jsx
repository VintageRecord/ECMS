import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post(`/auth/${mode}`, form);
      if (mode === 'login') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        setMode('login');
        alert('Account created! Please login.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1e1b4b' }}>
      <div className="card" style={{ width: 360 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6, color: '#4f46e5' }}>ECMS</h1>
        <p style={{ color: '#6b7280', marginBottom: 24 }}>{mode === 'login' ? 'Sign in to your account' : 'Create a new account'}</p>
        {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: 6, marginBottom: 16, fontSize: 14 }}>{error}</div>}
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
          <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button className="btn btn-primary" type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#6b7280' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span style={{ color: '#4f46e5', cursor: 'pointer', fontWeight: 600 }} onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Register' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}
