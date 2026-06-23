import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 220, background: '#1e1b4b', color: 'white', padding: '24px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid #312e81' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#a5b4fc' }}>ECMS</h2>
          <p style={{ fontSize: 12, color: '#818cf8', marginTop: 4 }}>Welcome, {user.username}</p>
        </div>
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {[
            { to: '/', label: 'Dashboard', icon: '⊞' },
            { to: '/pages', label: 'Pages', icon: '📄' },
            { to: '/media', label: 'Media', icon: '🖼' },
          ].map(({ to, label, icon }) => (
            <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 20px', color: isActive ? '#a5b4fc' : '#c7d2fe',
              background: isActive ? '#312e81' : 'transparent',
              fontSize: 14, fontWeight: isActive ? 600 : 400
            })}>
              <span>{icon}</span> {label}
            </NavLink>
          ))}
        </nav>
        <button onClick={logout} style={{ margin: '0 16px 16px', padding: '8px', background: '#312e81', color: '#a5b4fc', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          Logout
        </button>
      </aside>
      <main style={{ flex: 1, padding: 24, overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
