import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

export default function PreviewPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get(`/pages/view/${slug}`),
      api.get('/settings')
    ]).then(([pageRes, settingsRes]) => {
      setPage(pageRes.data);
      setSettings(settingsRes.data);
    }).catch(() => setError('Page not found or not published.'));
  }, [slug]);

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ fontSize: 24, color: '#ef4444' }}>404</h2>
      <p style={{ color: '#6b7280' }}>{error}</p>
    </div>
  );

  if (!page || !settings) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p style={{ color: '#6b7280' }}>Loading...</p>
    </div>
  );

  const navLinks = JSON.parse(settings.nav_links || '[]');
  const footerCols = JSON.parse(settings.footer_columns || '[]');

  let html = '';
  try {
    const projectData = JSON.parse(page.content);
    html = projectData?.pages?.[0]?.frames?.[0]?.component?.components?.map?.(c => c.content || '').join('') || '';
    if (!html && projectData?.html) html = projectData.html;
  } catch {
    html = page.content;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <nav style={{ background: settings.nav_bg_color, padding: '0 40px', display: 'flex', alignItems: 'center', gap: 32, height: 64, position: 'sticky', top: 0, zIndex: 100 }}>
        <span style={{ color: settings.nav_text_color, fontWeight: 700, fontSize: 20 }}>{settings.nav_logo}</span>
        <div style={{ display: 'flex', gap: 28, marginLeft: 'auto' }}>
          {navLinks.map((link, i) => (
            <a key={i} href={link.url} style={{ color: settings.nav_text_color, fontSize: 15, textDecoration: 'none' }}>{link.label}</a>
          ))}
        </div>
      </nav>

      {/* Page Content */}
      <main style={{ flex: 1 }}>
        <style>{page.css}</style>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </main>

      {/* Footer */}
      <footer style={{ background: settings.footer_bg_color, color: settings.footer_text_color, padding: '40px 40px 20px' }}>
        {footerCols.filter(c => c.heading).length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${footerCols.filter(c => c.heading).length}, 1fr)`, gap: 40, marginBottom: 32 }}>
            {footerCols.filter(c => c.heading).map((col, i) => (
              <div key={i}>
                <h4 style={{ fontWeight: 700, marginBottom: 14, fontSize: 15 }}>{col.heading}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.links.filter(l => l.label).map((link, j) => (
                    <a key={j} href={link.url} style={{ color: settings.footer_text_color, fontSize: 14, opacity: 0.8, textDecoration: 'none' }}>{link.label}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 16, fontSize: 13, opacity: 0.7 }}>{settings.footer_text}</div>
      </footer>
    </div>
  );
}
