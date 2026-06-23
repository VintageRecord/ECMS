import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import api from '../api';

export default function PageEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const gjsRef = useRef(null);
  const [form, setForm] = useState({ title: '', slug: '', status: 'draft' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const editor = grapesjs.init({
      container: '#gjs',
      height: 'calc(100vh - 200px)',
      fromElement: false,
      storageManager: false,
      plugins: [],
      canvas: { styles: [] },
      blockManager: {
        blocks: [
          { id: 'text', label: 'Text', content: '<div data-gjs-type="text" style="padding:10px;font-size:16px;">Edit this text</div>' },
          { id: 'heading', label: 'Heading', content: '<h1 style="padding:10px;">Heading</h1>' },
          { id: 'image', label: 'Image', content: '<img src="https://placehold.co/400x200" style="max-width:100%;"/>' },
          { id: 'button', label: 'Button', content: '<a href="#" style="display:inline-block;padding:10px 20px;background:#4f46e5;color:white;border-radius:6px;text-decoration:none;">Click Me</a>' },
          { id: 'columns-2', label: '2 Columns', content: '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:10px;"><div style="padding:10px;background:#f3f4f6;">Column 1</div><div style="padding:10px;background:#f3f4f6;">Column 2</div></div>' },
          { id: 'columns-3', label: '3 Columns', content: '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;padding:10px;"><div style="padding:10px;background:#f3f4f6;">Col 1</div><div style="padding:10px;background:#f3f4f6;">Col 2</div><div style="padding:10px;background:#f3f4f6;">Col 3</div></div>' },
          { id: 'divider', label: 'Divider', content: '<hr style="border:none;border-top:2px solid #e5e7eb;margin:16px 0;"/>' },
          { id: 'video', label: 'Video', content: '<video controls style="max-width:100%;"><source src="" /></video>' },
          { id: 'map', label: 'Map', content: '<iframe style="width:100%;height:300px;border:0;" src="https://maps.google.com/maps?q=New+York&output=embed"></iframe>' },
        ]
      },
      styleManager: {
        sectors: [
          {
            name: 'Typography', open: false, properties: [
              { name: 'Font Family', property: 'font-family', type: 'select', options: [
                { value: 'Arial, sans-serif', name: 'Arial' },
                { value: 'Georgia, serif', name: 'Georgia' },
                { value: '"Times New Roman", serif', name: 'Times New Roman' },
                { value: 'Verdana, sans-serif', name: 'Verdana' },
                { value: '"Courier New", monospace', name: 'Courier New' },
              ]},
              { name: 'Font Size', property: 'font-size', type: 'integer', units: ['px', 'em', 'rem', '%'] },
              { name: 'Font Weight', property: 'font-weight', type: 'select', options: [
                { value: '300', name: 'Light' }, { value: '400', name: 'Normal' },
                { value: '600', name: 'SemiBold' }, { value: '700', name: 'Bold' },
              ]},
              { name: 'Text Color', property: 'color', type: 'color' },
              { name: 'Text Align', property: 'text-align', type: 'radio', options: [
                { value: 'left', name: 'Left' }, { value: 'center', name: 'Center' },
                { value: 'right', name: 'Right' },
              ]},
              { name: 'Line Height', property: 'line-height', type: 'integer', units: ['px', 'em'] },
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
              { name: 'Background Color', property: 'background-color', type: 'color' },
              { name: 'Border Radius', property: 'border-radius', type: 'integer', units: ['px', '%'] },
              { name: 'Border Width', property: 'border-width', type: 'integer', units: ['px'] },
              { name: 'Border Color', property: 'border-color', type: 'color' },
              { name: 'Border Style', property: 'border-style', type: 'select', options: [
                { value: 'none', name: 'None' }, { value: 'solid', name: 'Solid' },
                { value: 'dashed', name: 'Dashed' }, { value: 'dotted', name: 'Dotted' },
              ]},
            ]
          },
          {
            name: 'Size & Position', open: false, properties: [
              { name: 'Width', property: 'width', type: 'integer', units: ['px', '%', 'em', 'vw'] },
              { name: 'Height', property: 'height', type: 'integer', units: ['px', '%', 'em', 'vh'] },
              { name: 'Position', property: 'position', type: 'select', options: [
                { value: 'static', name: 'Static' }, { value: 'relative', name: 'Relative' },
                { value: 'absolute', name: 'Absolute' }, { value: 'fixed', name: 'Fixed' },
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

    gjsRef.current = editor;

    // Load existing media as assets
    api.get('/media').then(r => {
      r.data.forEach(m => editor.AssetManager.add({ src: m.url, name: m.original_name }));
    }).catch(() => {});

    editorRef.current = editor;
    return () => editor.destroy();
  }, []);

  useEffect(() => {
    if (id) {
      api.get(`/pages/${id}`).then(({ data }) => {
        setForm({ title: data.title, slug: data.slug, status: data.status });
        if (gjsRef.current && data.content) {
          try {
            const content = JSON.parse(data.content);
            gjsRef.current.loadProjectData(content);
          } catch {
            gjsRef.current.setComponents(data.content);
          }
          if (data.css) gjsRef.current.setStyle(data.css);
        }
      }).catch(() => {});
    }
  }, [id]);

  const save = async (opts = {}) => {
    if (!form.title || !form.slug) return setMsg('Title and slug are required');
    setSaving(true);
    setMsg('');
    try {
      const content = JSON.stringify(gjsRef.current.getProjectData());
      const html = gjsRef.current.getHtml();
      const css = gjsRef.current.getCss();
      const payload = { ...form, content, html, css };
      let savedId = id;
      if (id) {
        await api.put(`/pages/${id}`, payload);
      } else {
        const res = await api.post('/pages', payload);
        savedId = res.data.id;
      }
      setMsg('Saved successfully!');
      if (opts.preview) {
        window.open(`/preview/${form.slug}`, '_blank');
      } else {
        setTimeout(() => navigate('/pages'), 1000);
      }
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed to save');
    }
    setSaving(false);
  };

  const autoSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', margin: -24 }}>
      <div style={{ padding: '12px 20px', background: 'white', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick={() => navigate('/pages')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#6b7280' }}>←</button>
        <input
          placeholder="Page Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value, slug: id ? form.slug : autoSlug(e.target.value) })}
          style={{ width: 200, padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }}
        />
        <input
          placeholder="slug"
          value={form.slug}
          onChange={e => setForm({ ...form, slug: e.target.value })}
          style={{ width: 160, padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }}
        />
        <select
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
          style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, width: 120 }}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', alignItems: 'center' }}>
          {msg && <span style={{ fontSize: 13, color: msg.includes('success') ? '#22c55e' : '#ef4444' }}>{msg}</span>}
          <button onClick={() => save({ preview: true })} disabled={saving} className="btn btn-secondary">
            Save & Preview
          </button>
          <button onClick={() => save()} disabled={saving} className="btn btn-primary">
            {saving ? 'Saving...' : 'Save Page'}
          </button>
        </div>
      </div>
      <div id="gjs" style={{ flex: 1 }} />
    </div>
  );
}
