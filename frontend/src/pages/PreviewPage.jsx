import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import api from '../api';

export default function PreviewPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [showTypography, setShowTypography] = useState(false);
  const [globalTypo, setGlobalTypo] = useState({ fontSize: 16, fontFamily: 'default', lineHeight: 1.6 });
  const gjsRef = useRef(null);
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    Promise.all([
      api.get(`/pages/view/${slug}`),
      api.get('/settings')
    ]).then(([pageRes, settingsRes]) => {
      setPage(pageRes.data);
      setSettings(settingsRes.data);
    }).catch(() => setError('Page not found or not published.'));
  }, [slug]);

  // Init / destroy GrapesJS when editMode toggles
  useEffect(() => {
    if (!editMode || !page) return;

    const editor = grapesjs.init({
      container: '#live-editor',
      height: '100%',
      fromElement: false,
      storageManager: false,
      plugins: [],
      blockManager: {
        blocks: [
          { id: 'text', label: 'Text', content: '<div data-gjs-type="text" style="padding:10px;font-size:16px;">Edit this text</div>' },
          { id: 'heading', label: 'Heading', content: '<h1 style="padding:10px;">Heading</h1>' },
          { id: 'image', label: 'Image', content: '<img src="https://placehold.co/400x200" style="max-width:100%;"/>' },
          { id: 'button', label: 'Button', content: '<a href="#" style="display:inline-block;padding:10px 20px;background:#6366f1;color:white;border-radius:6px;text-decoration:none;">Click Me</a>' },
          { id: 'columns-2', label: '2 Columns', content: '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:10px;"><div style="padding:10px;background:#f3f4f6;">Column 1</div><div style="padding:10px;background:#f3f4f6;">Column 2</div></div>' },
          { id: 'columns-3', label: '3 Columns', content: '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;padding:10px;"><div style="padding:10px;background:#f3f4f6;">Col 1</div><div style="padding:10px;background:#f3f4f6;">Col 2</div><div style="padding:10px;background:#f3f4f6;">Col 3</div></div>' },
          { id: 'divider', label: 'Divider', content: '<hr style="border:none;border-top:2px solid #e5e7eb;margin:16px 0;"/>' },
        ]
      },
      styleManager: {
        sectors: [
          {
            name: 'Typography', open: true, properties: [
              { name: 'Font Family', property: 'font-family', type: 'select', options: [
                { value: 'Arial, sans-serif', name: 'Arial' },
                { value: 'Georgia, serif', name: 'Georgia' },
                { value: '"Times New Roman", serif', name: 'Times New Roman' },
                { value: 'Verdana, sans-serif', name: 'Verdana' },
              ]},
              { name: 'Font Size', property: 'font-size', type: 'integer', units: ['px', 'em', 'rem', '%'] },
              { name: 'Font Weight', property: 'font-weight', type: 'select', options: [
                { value: '300', name: 'Light' }, { value: '400', name: 'Normal' },
                { value: '600', name: 'SemiBold' }, { value: '700', name: 'Bold' },
              ]},
              { name: 'Text Color', property: 'color', type: 'color' },
              { name: 'Text Align', property: 'text-align', type: 'radio', options: [
                { value: 'left', name: 'Left' }, { value: 'center', name: 'Center' }, { value: 'right', name: 'Right' },
              ]},
            ]
          },
          {
            name: 'Spacing', open: false, properties: [
              { name: 'Padding', property: 'padding', type: 'composite', properties: [
                { name: 'Top', property: 'padding-top', type: 'integer', units: ['px', 'em'] },
                { name: 'Right', property: 'padding-right', type: 'integer', units: ['px', 'em'] },
                { name: 'Bottom', property: 'padding-bottom', type: 'integer', units: ['px', 'em'] },
                { name: 'Left', property: 'padding-left', type: 'integer', units: ['px', 'em'] },
              ]},
              { name: 'Margin', property: 'margin', type: 'composite', properties: [
                { name: 'Top', property: 'margin-top', type: 'integer', units: ['px', 'em'] },
                { name: 'Right', property: 'margin-right', type: 'integer', units: ['px', 'em'] },
                { name: 'Bottom', property: 'margin-bottom', type: 'integer', units: ['px', 'em'] },
                { name: 'Left', property: 'margin-left', type: 'integer', units: ['px', 'em'] },
              ]},
            ]
          },
          {
            name: 'Background & Border', open: false, properties: [
              { name: 'Background', property: 'background-color', type: 'color' },
              { name: 'Border Radius', property: 'border-radius', type: 'integer', units: ['px', '%'] },
              { name: 'Border Width', property: 'border-width', type: 'integer', units: ['px'] },
              { name: 'Border Color', property: 'border-color', type: 'color' },
              { name: 'Border Style', property: 'border-style', type: 'select', options: [
                { value: 'none', name: 'None' }, { value: 'solid', name: 'Solid' }, { value: 'dashed', name: 'Dashed' },
              ]},
            ]
          },
        ]
      },
      assetManager: {
        assets: [],
        uploadFile: async (e) => {
          const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
          const formData = new FormData();
          formData.append('file', files[0]);
          try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/media/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData });
            const data = await res.json();
            editor.AssetManager.add({ src: data.url, name: data.original_name });
          } catch {}
        }
      }
    });

    // Load existing content
    try {
      const projectData = JSON.parse(page.content);
      if (projectData && (projectData.pages || projectData.components)) {
        editor.loadProjectData(projectData);
      } else {
        editor.setComponents(page.html || '');
        if (page.css) editor.setStyle(page.css);
      }
    } catch {
      editor.setComponents(page.html || '');
      if (page.css) editor.setStyle(page.css);
    }

    // Load media as assets
    api.get('/media').then(r => {
      r.data.forEach(m => editor.AssetManager.add({ src: m.url, name: m.original_name }));
    }).catch(() => {});

    gjsRef.current = editor;

    return () => {
      editor.destroy();
      gjsRef.current = null;
    };
  }, [editMode, page]);

  const saveChanges = async () => {
    if (!gjsRef.current) return;
    setSaving(true);
    setSaveMsg('');
    try {
      const content = JSON.stringify(gjsRef.current.getProjectData());
      const html = gjsRef.current.getHtml();
      const ff = globalTypo.fontFamily === 'default' ? 'inherit' : globalTypo.fontFamily;
      const typoCSS = `body { font-size: ${globalTypo.fontSize}px; font-family: ${ff}; line-height: ${globalTypo.lineHeight}; }\n`;
      const css = typoCSS + gjsRef.current.getCss();
      await api.put(`/pages/${page.id}`, { title: page.title, slug: page.slug, status: page.status, content, html, css });
      setPage(prev => ({ ...prev, content, html, css }));
      setSaveMsg('Saved!');
      setTimeout(() => setSaveMsg(''), 2000);
    } catch {
      setSaveMsg('Save failed');
    }
    setSaving(false);
  };

  const applyGlobalTypography = (typo) => {
    const editor = gjsRef.current;
    if (!editor) return;
    const doc = editor.Canvas.getDocument();
    if (!doc) return;
    let el = doc.getElementById('__global-typo__');
    if (!el) { el = doc.createElement('style'); el.id = '__global-typo__'; doc.head.appendChild(el); }
    const ff = typo.fontFamily === 'default' ? 'inherit' : typo.fontFamily;
    el.textContent = `body, body * { font-size: ${typo.fontSize}px !important; font-family: ${ff} !important; line-height: ${typo.lineHeight} !important; }`;
  };

  useEffect(() => {
    if (editMode) applyGlobalTypography(globalTypo);
  }, [globalTypo, editMode]);

  const discardChanges = () => {
    setEditMode(false);
    setShowTypography(false);
  };

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ fontSize: 24, color: '#ef4444' }}>404</h2>
      <p style={{ color: '#64748b' }}>{error}</p>
    </div>
  );

  if (!page || !settings) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: '#64748b', fontSize: 14 }}>Loading page...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const navLinks = JSON.parse(settings.nav_links || '[]');
  const footerCols = JSON.parse(settings.footer_columns || '[]');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Edit mode toolbar */}
      {isLoggedIn && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: '#0f172a', borderRadius: 14, padding: '10px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)', zIndex: 9999,
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          {/* Page title */}
          <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500, paddingRight: 8, borderRight: '1px solid rgba(255,255,255,0.1)' }}>
            {page.title}
          </span>

          {editMode ? (
            <>
              <span style={{ color: '#fbbf24', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 7, height: 7, background: '#fbbf24', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                Editing
              </span>
              <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>

              {saveMsg && (
                <span style={{ fontSize: 12, color: saveMsg === 'Saved!' ? '#34d399' : '#f87171', fontWeight: 600 }}>{saveMsg}</span>
              )}

              <button
                onClick={() => setShowTypography(!showTypography)}
                style={{ background: showTypography ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)', border: `1px solid ${showTypography ? '#6366f1' : 'rgba(255,255,255,0.1)'}`, color: showTypography ? '#a5b4fc' : '#94a3b8', padding: '7px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
                Typography
              </button>

              <button
                onClick={saveChanges}
                disabled={saving}
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: 'white', padding: '7px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {saving ? 'Saving...' : (
                  <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>Save Changes</>
                )}
              </button>

              <button
                onClick={discardChanges}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}
              >
                Exit Edit
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: 'white', padding: '7px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 7 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit Page
            </button>
          )}
        </div>
      )}

      {/* Global Typography panel — appears above the floating bar when in edit mode */}
      {isLoggedIn && editMode && showTypography && (
        <div style={{
          position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
          background: '#0f172a', borderRadius: 12, padding: '14px 20px',
          display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 9999,
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <span style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>TYPOGRAPHY</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ color: '#64748b', fontSize: 11, fontWeight: 600 }}>Size</label>
            <input
              type="range" min="10" max="28" step="1"
              value={globalTypo.fontSize}
              onChange={e => setGlobalTypo(t => ({ ...t, fontSize: Number(e.target.value) }))}
              style={{ width: 100, accentColor: '#6366f1' }}
            />
            <span style={{ color: 'white', fontSize: 12, fontWeight: 700, minWidth: 32 }}>{globalTypo.fontSize}px</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ color: '#64748b', fontSize: 11, fontWeight: 600 }}>Font</label>
            <select
              value={globalTypo.fontFamily}
              onChange={e => setGlobalTypo(t => ({ ...t, fontFamily: e.target.value }))}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: 'white', padding: '4px 8px', fontSize: 12, fontFamily: 'inherit' }}
            >
              <option value="default">Page Default</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="'Times New Roman', serif">Times New Roman</option>
              <option value="Verdana, sans-serif">Verdana</option>
              <option value="'Roboto', sans-serif">Roboto</option>
              <option value="'Open Sans', sans-serif">Open Sans</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ color: '#64748b', fontSize: 11, fontWeight: 600 }}>Line Height</label>
            <input
              type="range" min="1" max="2.5" step="0.1"
              value={globalTypo.lineHeight}
              onChange={e => setGlobalTypo(t => ({ ...t, lineHeight: Number(e.target.value) }))}
              style={{ width: 80, accentColor: '#6366f1' }}
            />
            <span style={{ color: 'white', fontSize: 12, fontWeight: 700, minWidth: 24 }}>{globalTypo.lineHeight}</span>
          </div>

          <button
            onClick={() => setGlobalTypo({ fontSize: 16, fontFamily: 'default', lineHeight: 1.6 })}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}
          >
            Reset
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ background: settings.nav_bg_color, padding: '0 40px', display: 'flex', alignItems: 'center', gap: 32, height: 64, position: 'sticky', top: 0, zIndex: editMode ? 0 : 100 }}>
        <span style={{ color: settings.nav_text_color, fontWeight: 700, fontSize: 20 }}>{settings.nav_logo}</span>
        <div style={{ display: 'flex', gap: 28, marginLeft: 'auto' }}>
          {navLinks.map((link, i) => (
            <a key={i} href={link.url} style={{ color: settings.nav_text_color, fontSize: 15, textDecoration: 'none' }}>{link.label}</a>
          ))}
        </div>
      </nav>

      {/* SEO meta tags */}
      {page.meta_title && <title>{page.meta_title}</title>}
      {page.meta_description && <meta name="description" content={page.meta_description} />}

      {/* Page Content — switches between view and edit */}
      <main style={{ flex: 1, position: 'relative' }}>
        {editMode ? (
          <div id="live-editor" style={{ minHeight: '60vh' }} />
        ) : (
          <>
            <style>{page.css}</style>
            <div dangerouslySetInnerHTML={{ __html: page.html || '' }} />
          </>
        )}
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
