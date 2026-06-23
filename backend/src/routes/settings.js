const router = require('express').Router();
const db = require('../database');
const auth = require('../middleware/auth');

const DEFAULTS = {
  nav_links: JSON.stringify([
    { label: 'Home', url: '/' },
    { label: 'About', url: '/about' },
    { label: 'Contact', url: '/contact' }
  ]),
  nav_logo: 'My Website',
  nav_bg_color: '#1e1b4b',
  nav_text_color: '#ffffff',
  footer_text: '© 2024 My Website. All rights reserved.',
  footer_bg_color: '#1e1b4b',
  footer_text_color: '#ffffff',
  footer_columns: JSON.stringify([
    { heading: 'Company', links: [{ label: 'About', url: '/about' }, { label: 'Contact', url: '/contact' }] },
    { heading: 'Social', links: [{ label: 'Facebook', url: '#' }, { label: 'Instagram', url: '#' }] }
  ])
};

// Get all settings (public)
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT key, value FROM settings').all();
  const result = { ...DEFAULTS };
  rows.forEach(r => { result[r.key] = r.value; });
  res.json(result);
});

// Update settings (protected)
router.post('/', auth, (req, res) => {
  const upsert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value');
  const update = db.transaction((data) => {
    Object.entries(data).forEach(([key, value]) => {
      upsert.run(key, typeof value === 'string' ? value : JSON.stringify(value));
    });
  });
  update(req.body);
  res.json({ message: 'Settings saved' });
});

module.exports = router;
