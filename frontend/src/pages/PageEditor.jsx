import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import api from '../api';

const TEMPLATES = [
  {
    id: 'blank',
    name: 'Blank Page',
    description: 'Start from scratch',
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>,
    html: '<div style="padding:40px;min-height:400px;"></div>',
    css: '',
  },
  {
    id: 'hero',
    name: 'Hero + Content',
    description: 'Big banner with content below',
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="8" rx="1"/><rect x="3" y="13" width="18" height="8" rx="1"/></svg>,
    html: `<div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:80px 40px;text-align:center;color:white;">
  <h1 style="font-size:48px;font-weight:800;margin-bottom:16px;">Welcome to Our Website</h1>
  <p style="font-size:20px;opacity:0.9;margin-bottom:32px;">We help businesses grow with amazing solutions.</p>
  <a href="#" style="background:white;color:#6366f1;padding:14px 32px;border-radius:8px;font-weight:700;text-decoration:none;font-size:16px;">Get Started</a>
</div>
<div style="max-width:800px;margin:60px auto;padding:0 40px;">
  <h2 style="font-size:32px;font-weight:700;margin-bottom:16px;color:#0f172a;">About Us</h2>
  <p style="font-size:16px;color:#64748b;line-height:1.8;">Write your content here. Click on any element to edit it. You can change the text, colors, fonts and more using the panel on the right.</p>
</div>`,
    css: '',
  },
  {
    id: 'about',
    name: 'About Page',
    description: 'Team and company info layout',
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
    html: `<div style="max-width:900px;margin:0 auto;padding:60px 40px;">
  <h1 style="font-size:40px;font-weight:800;color:#0f172a;margin-bottom:12px;">About Us</h1>
  <p style="font-size:18px;color:#6366f1;font-weight:500;margin-bottom:40px;">Our story, mission and team.</p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-bottom:60px;">
    <div>
      <h2 style="font-size:24px;font-weight:700;margin-bottom:12px;color:#0f172a;">Our Mission</h2>
      <p style="color:#64748b;line-height:1.8;">Write your mission statement here. Tell visitors what you stand for and what drives you every day.</p>
    </div>
    <div>
      <h2 style="font-size:24px;font-weight:700;margin-bottom:12px;color:#0f172a;">Our Vision</h2>
      <p style="color:#64748b;line-height:1.8;">Describe your vision for the future. What impact do you want to make in your industry?</p>
    </div>
  </div>
  <h2 style="font-size:28px;font-weight:700;margin-bottom:24px;color:#0f172a;">Our Team</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
    <div style="text-align:center;padding:24px;border:1px solid #e2e8f0;border-radius:12px;">
      <div style="width:80px;height:80px;background:#eef2ff;border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:32px;color:#6366f1;">J</div>
      <h3 style="font-weight:700;margin-bottom:4px;">John Smith</h3>
      <p style="color:#64748b;font-size:14px;">CEO & Founder</p>
    </div>
    <div style="text-align:center;padding:24px;border:1px solid #e2e8f0;border-radius:12px;">
      <div style="width:80px;height:80px;background:#ecfdf5;border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:32px;color:#10b981;">S</div>
      <h3 style="font-weight:700;margin-bottom:4px;">Sarah Lee</h3>
      <p style="color:#64748b;font-size:14px;">Head of Design</p>
    </div>
    <div style="text-align:center;padding:24px;border:1px solid #e2e8f0;border-radius:12px;">
      <div style="width:80px;height:80px;background:#fffbeb;border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:32px;color:#f59e0b;">M</div>
      <h3 style="font-weight:700;margin-bottom:4px;">Mike Chen</h3>
      <p style="color:#64748b;font-size:14px;">Lead Developer</p>
    </div>
  </div>
</div>`,
    css: '',
  },
  {
    id: 'contact',
    name: 'Contact Page',
    description: 'Contact info and details',
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.79a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z"/></svg>,
    html: `<div style="max-width:800px;margin:0 auto;padding:60px 40px;">
  <h1 style="font-size:40px;font-weight:800;color:#0f172a;margin-bottom:12px;">Contact Us</h1>
  <p style="font-size:18px;color:#64748b;margin-bottom:48px;">We'd love to hear from you. Reach out anytime.</p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;">
    <div>
      <h2 style="font-size:20px;font-weight:700;margin-bottom:24px;color:#0f172a;">Get in Touch</h2>
      <div style="display:flex;flex-direction:column;gap:20px;">
        <div style="display:flex;gap:16px;align-items:flex-start;">
          <div style="width:40px;height:40px;background:#eef2ff;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#6366f1;font-weight:700;">@</div>
          <div><p style="font-weight:600;margin-bottom:4px;">Email</p><p style="color:#64748b;">hello@yourcompany.com</p></div>
        </div>
        <div style="display:flex;gap:16px;align-items:flex-start;">
          <div style="width:40px;height:40px;background:#ecfdf5;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#10b981;font-weight:700;">#</div>
          <div><p style="font-weight:600;margin-bottom:4px;">Phone</p><p style="color:#64748b;">+1 (555) 000-0000</p></div>
        </div>
        <div style="display:flex;gap:16px;align-items:flex-start;">
          <div style="width:40px;height:40px;background:#fffbeb;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#f59e0b;font-weight:700;">P</div>
          <div><p style="font-weight:600;margin-bottom:4px;">Address</p><p style="color:#64748b;">123 Main Street<br/>New York, NY 10001</p></div>
        </div>
      </div>
    </div>
    <div style="background:#f8fafc;border-radius:12px;padding:32px;">
      <p style="font-weight:600;margin-bottom:8px;">Name</p>
      <div style="background:white;border:1px solid #e2e8f0;border-radius:8px;padding:12px;margin-bottom:16px;color:#94a3b8;">Your full name</div>
      <p style="font-weight:600;margin-bottom:8px;">Email</p>
      <div style="background:white;border:1px solid #e2e8f0;border-radius:8px;padding:12px;margin-bottom:16px;color:#94a3b8;">your@email.com</div>
      <p style="font-weight:600;margin-bottom:8px;">Message</p>
      <div style="background:white;border:1px solid #e2e8f0;border-radius:8px;padding:12px;margin-bottom:24px;height:100px;color:#94a3b8;">Write your message...</div>
      <div style="background:#6366f1;color:white;padding:12px;border-radius:8px;text-align:center;font-weight:700;cursor:pointer;">Send Message</div>
    </div>
  </div>
</div>`,
    css: '',
  },
  {
    id: 'services',
    name: 'Services Page',
    description: 'Showcase what you offer',
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
    html: `<div style="max-width:1000px;margin:0 auto;padding:60px 40px;">
  <div style="text-align:center;margin-bottom:60px;">
    <h1 style="font-size:40px;font-weight:800;color:#0f172a;margin-bottom:16px;">Our Services</h1>
    <p style="font-size:18px;color:#64748b;max-width:500px;margin:0 auto;">Everything you need to grow your business in one place.</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
    <div style="padding:32px;border:1px solid #e2e8f0;border-radius:12px;">
      <div style="width:52px;height:52px;background:#eef2ff;border-radius:12px;margin-bottom:20px;display:flex;align-items:center;justify-content:center;color:#6366f1;font-size:24px;font-weight:800;">1</div>
      <h3 style="font-size:20px;font-weight:700;margin-bottom:12px;color:#0f172a;">Service One</h3>
      <p style="color:#64748b;line-height:1.7;">Describe this service here. What problem does it solve? Who is it for?</p>
    </div>
    <div style="padding:32px;border:1px solid #e2e8f0;border-radius:12px;">
      <div style="width:52px;height:52px;background:#ecfdf5;border-radius:12px;margin-bottom:20px;display:flex;align-items:center;justify-content:center;color:#10b981;font-size:24px;font-weight:800;">2</div>
      <h3 style="font-size:20px;font-weight:700;margin-bottom:12px;color:#0f172a;">Service Two</h3>
      <p style="color:#64748b;line-height:1.7;">Describe this service here. What problem does it solve? Who is it for?</p>
    </div>
    <div style="padding:32px;border:1px solid #e2e8f0;border-radius:12px;">
      <div style="width:52px;height:52px;background:#fffbeb;border-radius:12px;margin-bottom:20px;display:flex;align-items:center;justify-content:center;color:#f59e0b;font-size:24px;font-weight:800;">3</div>
      <h3 style="font-size:20px;font-weight:700;margin-bottom:12px;color:#0f172a;">Service Three</h3>
      <p style="color:#64748b;line-height:1.7;">Describe this service here. What problem does it solve? Who is it for?</p>
    </div>
  </div>
</div>`,
    css: '',
  },
];

export default function PageEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const gjsRef = useRef(null);
  const [form, setForm] = useState({ title: '', slug: '', status: 'draft', meta_title: '', meta_description: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [showTemplate, setShowTemplate] = useState(!id);
  const [showSEO, setShowSEO] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    if (showTemplate) return;

    const editor = grapesjs.init({
      container: '#gjs',
      height: '100%',
      fromElement: false,
      storageManager: false,
      plugins: [],
      canvas: { styles: [] },
      blockManager: {
        blocks: [
          { id: 'text', label: 'Text', content: '<div data-gjs-type="text" style="padding:10px;font-size:16px;">Edit this text</div>' },
          { id: 'heading', label: 'Heading', content: '<h1 style="padding:10px;">Heading</h1>' },
          { id: 'image', label: 'Image', content: '<img src="https://placehold.co/400x200" style="max-width:100%;"/>' },
          { id: 'button', label: 'Button', content: '<a href="#" style="display:inline-block;padding:10px 20px;background:#6366f1;color:white;border-radius:6px;text-decoration:none;">Click Me</a>' },
          { id: 'columns-2', label: '2 Columns', content: '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:10px;"><div style="padding:10px;background:#f3f4f6;">Column 1</div><div style="padding:10px;background:#f3f4f6;">Column 2</div></div>' },
          { id: 'columns-3', label: '3 Columns', content: '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;padding:10px;"><div style="padding:10px;background:#f3f4f6;">Col 1</div><div style="padding:10px;background:#f3f4f6;">Col 2</div><div style="padding:10px;background:#f3f4f6;">Col 3</div></div>' },
          { id: 'divider', label: 'Divider', content: '<hr style="border:none;border-top:2px solid #e5e7eb;margin:16px 0;"/>' },
          { id: 'video', label: 'Video', content: '<video controls style="max-width:100%;"><source src="" /></video>' },
        ]
      },
      styleManager: {
        sectors: [
          { name: 'Typography', open: false, properties: [
            { name: 'Font Family', property: 'font-family', type: 'select', options: [
              { value: 'Arial, sans-serif', name: 'Arial' }, { value: 'Georgia, serif', name: 'Georgia' },
              { value: '"Times New Roman", serif', name: 'Times New Roman' }, { value: 'Verdana, sans-serif', name: 'Verdana' },
              { value: '"Courier New", monospace', name: 'Courier New' },
            ]},
            { name: 'Font Size', property: 'font-size', type: 'integer', units: ['px', 'em', 'rem', '%'] },
            { name: 'Font Weight', property: 'font-weight', type: 'select', options: [
              { value: '300', name: 'Light' }, { value: '400', name: 'Normal' }, { value: '600', name: 'SemiBold' }, { value: '700', name: 'Bold' },
            ]},
            { name: 'Text Color', property: 'color', type: 'color' },
            { name: 'Text Align', property: 'text-align', type: 'radio', options: [
              { value: 'left', name: 'Left' }, { value: 'center', name: 'Center' }, { value: 'right', name: 'Right' },
            ]},
            { name: 'Line Height', property: 'line-height', type: 'integer', units: ['px', 'em'] },
          ]},
          { name: 'Spacing', open: false, properties: [
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
          ]},
          { name: 'Background & Border', open: false, properties: [
            { name: 'Background Color', property: 'background-color', type: 'color' },
            { name: 'Border Radius', property: 'border-radius', type: 'integer', units: ['px', '%'] },
            { name: 'Border Width', property: 'border-width', type: 'integer', units: ['px'] },
            { name: 'Border Color', property: 'border-color', type: 'color' },
            { name: 'Border Style', property: 'border-style', type: 'select', options: [
              { value: 'none', name: 'None' }, { value: 'solid', name: 'Solid' }, { value: 'dashed', name: 'Dashed' },
            ]},
          ]},
          { name: 'Size & Position', open: false, properties: [
            { name: 'Width', property: 'width', type: 'integer', units: ['px', '%', 'em', 'vw'] },
            { name: 'Height', property: 'height', type: 'integer', units: ['px', '%', 'em', 'vh'] },
          ]},
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

    gjsRef.current = editor;

    // Track undo/redo state
    const updateUndoRedo = () => {
      setCanUndo(editor.UndoManager.hasUndo());
      setCanRedo(editor.UndoManager.hasRedo());
    };
    editor.on('component:add component:remove component:update', updateUndoRedo);
    editor.on('undo redo', updateUndoRedo);

    // Load media as assets
    api.get('/media').then(r => {
      r.data.forEach(m => editor.AssetManager.add({ src: m.url, name: m.original_name }));
    }).catch(() => {});

    // Load template or existing page content
    if (id) {
      api.get(`/pages/${id}`).then(({ data }) => {
        setForm({ title: data.title, slug: data.slug, status: data.status, meta_title: data.meta_title || '', meta_description: data.meta_description || '' });
        try {
          const projectData = JSON.parse(data.content);
          if (projectData && (projectData.pages || projectData.components)) {
            editor.loadProjectData(projectData);
          } else {
            editor.setComponents(data.html || '');
            if (data.css) editor.setStyle(data.css);
          }
        } catch {
          editor.setComponents(data.html || '');
          if (data.css) editor.setStyle(data.css);
        }
      }).catch(() => {});
    } else if (selectedTemplate) {
      editor.setComponents(selectedTemplate.html);
      if (selectedTemplate.css) editor.setStyle(selectedTemplate.css);
    }

    return () => editor.destroy();
  }, [showTemplate]);

  const save = async (opts = {}) => {
    if (!form.title || !form.slug) return setMsg('Title and slug are required');
    setSaving(true);
    setMsg('');
    try {
      const content = JSON.stringify(gjsRef.current.getProjectData());
      const html = gjsRef.current.getHtml();
      const css = gjsRef.current.getCss();
      const payload = { ...form, content, html, css };
      if (id) {
        await api.put(`/pages/${id}`, payload);
      } else {
        await api.post('/pages', payload);
      }
      setMsg('Saved!');
      if (opts.preview) {
        window.open(`/preview/${form.slug}`, '_blank');
      } else {
        setTimeout(() => navigate('/pages'), 800);
      }
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed to save');
    }
    setSaving(false);
  };

  const autoSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const btnStyle = (disabled) => ({ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: disabled ? '#475569' : '#94a3b8', padding: '6px 10px', borderRadius: 7, cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', fontFamily: 'inherit' });

  // Template picker screen
  if (showTemplate && !id) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', margin: -32 }}>
        <div style={{ padding: '20px 32px', background: 'var(--sidebar-bg)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate('/pages')} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '7px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, fontFamily: 'inherit' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>Choose a Template</span>
        </div>
        <div style={{ flex: 1, padding: '40px 60px' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 15 }}>Pick a starting layout or begin with a blank page. You can change everything after.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {TEMPLATES.map(t => (
              <div
                key={t.id}
                onClick={() => setSelectedTemplate(t)}
                style={{
                  background: 'var(--surface)', border: `2px solid ${selectedTemplate?.id === t.id ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 12, padding: 24, cursor: 'pointer', transition: 'all 0.15s',
                  boxShadow: selectedTemplate?.id === t.id ? '0 0 0 3px rgba(99,102,241,0.15)' : 'none',
                }}
              >
                <div style={{ color: selectedTemplate?.id === t.id ? 'var(--primary)' : 'var(--text-muted)', marginBottom: 16 }}>{t.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{t.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t.description}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 40, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => { if (selectedTemplate) setShowTemplate(false); }}
              disabled={!selectedTemplate}
              style={{ background: selectedTemplate ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#e2e8f0', border: 'none', color: selectedTemplate ? 'white' : '#94a3b8', padding: '12px 32px', borderRadius: 10, cursor: selectedTemplate ? 'pointer' : 'not-allowed', fontSize: 15, fontWeight: 700, fontFamily: 'inherit' }}
            >
              Start Editing
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', margin: -32 }}>
      {/* Toolbar */}
      <div style={{ padding: '0 16px', background: 'var(--sidebar-bg)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, height: 60 }}>
        <button onClick={() => navigate('/pages')} style={{ ...btnStyle(false), gap: 6, fontSize: 13, fontWeight: 500 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Pages
        </button>

        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />

        {/* Undo / Redo */}
        <button title="Undo" disabled={!canUndo} onClick={() => gjsRef.current?.UndoManager.undo()} style={btnStyle(!canUndo)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
        </button>
        <button title="Redo" disabled={!canRedo} onClick={() => gjsRef.current?.UndoManager.redo()} style={btnStyle(!canRedo)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
        </button>

        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />

        <input
          placeholder="Page Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value, slug: id ? form.slug : autoSlug(e.target.value) })}
          style={{ width: 200, padding: '7px 12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, fontSize: 13, color: 'white', fontFamily: 'inherit' }}
        />

        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 10px', gap: 4 }}>
          <span style={{ color: '#64748b', fontSize: 12 }}>/</span>
          <input
            placeholder="slug"
            value={form.slug}
            onChange={e => setForm({ ...form, slug: e.target.value })}
            style={{ width: 120, padding: 0, background: 'transparent', border: 'none', fontSize: 13, color: '#94a3b8', fontFamily: 'inherit', boxShadow: 'none' }}
          />
        </div>

        <select
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
          style={{ padding: '7px 10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, fontSize: 13, width: 120, color: form.status === 'published' ? '#34d399' : '#fbbf24', fontFamily: 'inherit', cursor: 'pointer' }}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        {/* SEO button */}
        <button
          title="SEO Settings"
          onClick={() => setShowSEO(!showSEO)}
          style={{ ...btnStyle(false), color: showSEO ? '#a5b4fc' : '#94a3b8', borderColor: showSEO ? '#6366f1' : 'rgba(255,255,255,0.12)', gap: 6, fontSize: 12, fontWeight: 600 }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          SEO
        </button>

        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', alignItems: 'center' }}>
          {msg && <span style={{ fontSize: 12, color: msg === 'Saved!' ? '#34d399' : '#f87171', fontWeight: 600 }}>{msg}</span>}
          {form.slug && (
            <a
              href={`/preview/${form.slug}`}
              target="_blank"
              rel="noreferrer"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Preview
            </a>
          )}
          <button onClick={() => save()} disabled={saving} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: 'white', padding: '7px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}>
            {saving ? 'Saving...' : 'Save Page'}
          </button>
        </div>
      </div>

      {/* SEO panel */}
      {showSEO && (
        <div style={{ background: '#1e293b', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>SEO</span>
          <div style={{ display: 'flex', gap: 12, flex: 1 }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#64748b', fontSize: 11, marginBottom: 4, fontWeight: 600 }}>Meta Title <span style={{ color: '#475569' }}>(shown in Google)</span></div>
              <input
                value={form.meta_title}
                onChange={e => setForm({ ...form, meta_title: e.target.value })}
                placeholder={form.title || 'Page title for search engines'}
                maxLength={60}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: 'white', padding: '7px 10px', fontSize: 13 }}
              />
              <div style={{ color: '#475569', fontSize: 10, marginTop: 3 }}>{(form.meta_title || '').length}/60 characters</div>
            </div>
            <div style={{ flex: 2 }}>
              <div style={{ color: '#64748b', fontSize: 11, marginBottom: 4, fontWeight: 600 }}>Meta Description <span style={{ color: '#475569' }}>(shown below title in Google)</span></div>
              <input
                value={form.meta_description}
                onChange={e => setForm({ ...form, meta_description: e.target.value })}
                placeholder="Brief description of this page for search engines..."
                maxLength={160}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: 'white', padding: '7px 10px', fontSize: 13 }}
              />
              <div style={{ color: '#475569', fontSize: 10, marginTop: 3 }}>{(form.meta_description || '').length}/160 characters</div>
            </div>
          </div>
        </div>
      )}

      <div id="gjs" style={{ flex: 1 }} />
    </div>
  );
}
