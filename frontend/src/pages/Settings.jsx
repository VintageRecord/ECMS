import React, { useEffect, useState } from 'react';
import api from '../api';

const defaultNav = [{ label: '', url: '' }];
const defaultFooterCols = [{ heading: '', links: [{ label: '', url: '' }] }];

export default function Settings() {
  const [tab, setTab] = useState('nav');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  // Nav state
  const [navLogo, setNavLogo] = useState('My Website');
  const [navBg, setNavBg] = useState('#1e1b4b');
  const [navText, setNavText] = useState('#ffffff');
  const [navLinks, setNavLinks] = useState(defaultNav);

  // Footer state
  const [footerText, setFooterText] = useState('© 2024 My Website. All rights reserved.');
  const [footerBg, setFooterBg] = useState('#1e1b4b');
  const [footerTextColor, setFooterTextColor] = useState('#ffffff');
  const [footerCols, setFooterCols] = useState(defaultFooterCols);

  useEffect(() => {
    api.get('/settings').then(({ data }) => {
      setNavLogo(data.nav_logo || '');
      setNavBg(data.nav_bg_color || '#1e1b4b');
      setNavText(data.nav_text_color || '#ffffff');
      setNavLinks(JSON.parse(data.nav_links || '[]'));
      setFooterText(data.footer_text || '');
      setFooterBg(data.footer_bg_color || '#1e1b4b');
      setFooterTextColor(data.footer_text_color || '#ffffff');
      setFooterCols(JSON.parse(data.footer_columns || '[]'));
    }).catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    setMsg('');
    try {
      await api.post('/settings', {
        nav_logo: navLogo,
        nav_bg_color: navBg,
        nav_text_color: navText,
        nav_links: JSON.stringify(navLinks.filter(l => l.label)),
        footer_text: footerText,
        footer_bg_color: footerBg,
        footer_text_color: footerTextColor,
        footer_columns: JSON.stringify(footerCols.filter(c => c.heading))
      });
      setMsg('Saved successfully!');
    } catch {
      setMsg('Failed to save');
    }
    setSaving(false);
  };

  // Nav link helpers
  const updateNavLink = (i, field, val) => setNavLinks(navLinks.map((l, idx) => idx === i ? { ...l, [field]: val } : l));
  const addNavLink = () => setNavLinks([...navLinks, { label: '', url: '' }]);
  const removeNavLink = (i) => setNavLinks(navLinks.filter((_, idx) => idx !== i));

  // Footer column helpers
  const updateColHeading = (ci, val) => setFooterCols(footerCols.map((c, i) => i === ci ? { ...c, heading: val } : c));
  const addCol = () => setFooterCols([...footerCols, { heading: '', links: [{ label: '', url: '' }] }]);
  const removeCol = (ci) => setFooterCols(footerCols.filter((_, i) => i !== ci));
  const updateColLink = (ci, li, field, val) => setFooterCols(footerCols.map((c, i) => i === ci ? { ...c, links: c.links.map((l, j) => j === li ? { ...l, [field]: val } : l) } : c));
  const addColLink = (ci) => setFooterCols(footerCols.map((c, i) => i === ci ? { ...c, links: [...c.links, { label: '', url: '' }] } : c));
  const removeColLink = (ci, li) => setFooterCols(footerCols.map((c, i) => i === ci ? { ...c, links: c.links.filter((_, j) => j !== li) } : c));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Site Settings</h1>
          <p className="page-subtitle">Manage your navigation menu and footer</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {msg && <span style={{ fontSize: 13, color: msg.includes('success') ? 'var(--success)' : 'var(--danger)', fontWeight: 500 }}>{msg}</span>}
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab${tab === 'nav' ? ' active' : ''}`} onClick={() => setTab('nav')}>Navigation Menu</button>
        <button className={`tab${tab === 'footer' ? ' active' : ''}`} onClick={() => setTab('footer')}>Footer</button>
        <button className={`tab${tab === 'preview' ? ' active' : ''}`} onClick={() => setTab('preview')}>Live Preview</button>
      </div>

      {/* NAV TAB */}
      {tab === 'nav' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Appearance</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 6 }}>Logo / Site Name</label>
                <input value={navLogo} onChange={e => setNavLogo(e.target.value)} placeholder="My Website" />
              </div>
              <div>
                <label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 6 }}>Background Color</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="color" value={navBg} onChange={e => setNavBg(e.target.value)} style={{ width: 44, height: 38, padding: 2, cursor: 'pointer' }} />
                  <input value={navBg} onChange={e => setNavBg(e.target.value)} style={{ flex: 1 }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 6 }}>Text Color</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="color" value={navText} onChange={e => setNavText(e.target.value)} style={{ width: 44, height: 38, padding: 2, cursor: 'pointer' }} />
                  <input value={navText} onChange={e => setNavText(e.target.value)} style={{ flex: 1 }} />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 600 }}>Navigation Links</h3>
              <button className="btn btn-primary" onClick={addNavLink} style={{ fontSize: 12, padding: '5px 12px' }}>+ Add Link</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {navLinks.map((link, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ color: '#9ca3af', cursor: 'grab', display: 'flex' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg></span>
                  <input placeholder="Label (e.g. Home)" value={link.label} onChange={e => updateNavLink(i, 'label', e.target.value)} style={{ flex: 1 }} />
                  <input placeholder="URL (e.g. /home)" value={link.url} onChange={e => updateNavLink(i, 'url', e.target.value)} style={{ flex: 1 }} />
                  <button onClick={() => removeNavLink(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 18 }}>×</button>
                </div>
              ))}
              {navLinks.length === 0 && <p style={{ color: '#9ca3af', fontSize: 14 }}>No links yet. Click "+ Add Link" to add one.</p>}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER TAB */}
      {tab === 'footer' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Appearance</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 6 }}>Copyright Text</label>
                <input value={footerText} onChange={e => setFooterText(e.target.value)} placeholder="© 2024 My Website" />
              </div>
              <div>
                <label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 6 }}>Background Color</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="color" value={footerBg} onChange={e => setFooterBg(e.target.value)} style={{ width: 44, height: 38, padding: 2, cursor: 'pointer' }} />
                  <input value={footerBg} onChange={e => setFooterBg(e.target.value)} style={{ flex: 1 }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 6 }}>Text Color</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="color" value={footerTextColor} onChange={e => setFooterTextColor(e.target.value)} style={{ width: 44, height: 38, padding: 2, cursor: 'pointer' }} />
                  <input value={footerTextColor} onChange={e => setFooterTextColor(e.target.value)} style={{ flex: 1 }} />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 600 }}>Footer Columns</h3>
              <button className="btn btn-primary" onClick={addCol} style={{ fontSize: 12, padding: '5px 12px' }}>+ Add Column</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {footerCols.map((col, ci) => (
                <div key={ci} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <input placeholder="Column Heading" value={col.heading} onChange={e => updateColHeading(ci, e.target.value)} style={{ fontWeight: 600 }} />
                    <button onClick={() => removeCol(ci)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 18, marginLeft: 8 }}>×</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {col.links.map((link, li) => (
                      <div key={li} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <input placeholder="Label" value={link.label} onChange={e => updateColLink(ci, li, 'label', e.target.value)} style={{ flex: 1, fontSize: 13 }} />
                        <input placeholder="URL" value={link.url} onChange={e => updateColLink(ci, li, 'url', e.target.value)} style={{ flex: 1, fontSize: 13 }} />
                        <button onClick={() => removeColLink(ci, li)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>×</button>
                      </div>
                    ))}
                    <button onClick={() => addColLink(ci)} style={{ background: 'none', border: '1px dashed #d1d5db', borderRadius: 4, padding: '4px', cursor: 'pointer', color: '#6b7280', fontSize: 12 }}>+ Add Link</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW TAB */}
      {tab === 'preview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <p style={{ padding: '10px 16px', fontSize: 12, color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>Navigation Preview</p>
            <nav style={{ background: navBg, padding: '0 24px', display: 'flex', alignItems: 'center', gap: 32, height: 60 }}>
              <span style={{ color: navText, fontWeight: 700, fontSize: 18 }}>{navLogo}</span>
              <div style={{ display: 'flex', gap: 24, marginLeft: 'auto' }}>
                {navLinks.filter(l => l.label).map((link, i) => (
                  <a key={i} href={link.url} style={{ color: navText, fontSize: 14, textDecoration: 'none' }}>{link.label}</a>
                ))}
              </div>
            </nav>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <p style={{ padding: '10px 16px', fontSize: 12, color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>Footer Preview</p>
            <footer style={{ background: footerBg, color: footerTextColor, padding: '32px 40px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${footerCols.filter(c => c.heading).length || 1}, 1fr)`, gap: 32, marginBottom: 24 }}>
                {footerCols.filter(c => c.heading).map((col, i) => (
                  <div key={i}>
                    <h4 style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>{col.heading}</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {col.links.filter(l => l.label).map((link, j) => (
                        <a key={j} href={link.url} style={{ color: footerTextColor, fontSize: 13, opacity: 0.8, textDecoration: 'none' }}>{link.label}</a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 16, fontSize: 13, opacity: 0.7 }}>{footerText}</div>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
