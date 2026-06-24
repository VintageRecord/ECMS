import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pages from './pages/Pages';
import PageEditor from './pages/PageEditor';
import Media from './pages/Media';
import Settings from './pages/Settings';
import Users from './pages/Users';
import PreviewPage from './pages/PreviewPage';
import Layout from './components/Layout';

const PrivateRoute = ({ children }) => {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return localStorage.getItem('token') && user.role === 'admin' ? children : <Navigate to="/" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/preview/:slug" element={<PreviewPage />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="pages" element={<Pages />} />
          <Route path="pages/new" element={<PageEditor />} />
          <Route path="pages/edit/:id" element={<PageEditor />} />
          <Route path="media" element={<Media />} />
          <Route path="settings" element={<Settings />} />
          <Route path="users" element={<AdminRoute><Users /></AdminRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
