const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const auth = require('../middleware/auth');

// Get all pages
router.get('/', auth, (req, res) => {
  const pages = db.prepare('SELECT id, title, slug, status, created_at, updated_at FROM pages').all();
  res.json(pages);
});

// Get single page by slug (public)
router.get('/view/:slug', (req, res) => {
  const page = db.prepare('SELECT * FROM pages WHERE slug = ? AND status = ?').get(req.params.slug, 'published');
  if (!page) return res.status(404).json({ error: 'Page not found' });
  res.json(page);
});

// Get single page by id (for editor)
router.get('/:id', auth, (req, res) => {
  const page = db.prepare('SELECT * FROM pages WHERE id = ?').get(req.params.id);
  if (!page) return res.status(404).json({ error: 'Page not found' });
  res.json(page);
});

// Create page
router.post('/', auth, (req, res) => {
  const { title, slug, content, css, status } = req.body;
  if (!title || !slug) return res.status(400).json({ error: 'Title and slug required' });
  const { html } = req.body;
  try {
    const id = uuidv4();
    db.prepare('INSERT INTO pages (id, title, slug, content, html, css, status) VALUES (?, ?, ?, ?, ?, ?, ?)').run(id, title, slug, content || '{}', html || '', css || '', status || 'draft');
    res.json({ id, message: 'Page created' });
  } catch {
    res.status(400).json({ error: 'Slug already exists' });
  }
});

// Update page
router.put('/:id', auth, (req, res) => {
  const existing = db.prepare('SELECT id FROM pages WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Page not found' });
  const { title, slug, content, html, css, status } = req.body;
  try {
    db.prepare('UPDATE pages SET title=?, slug=?, content=?, html=?, css=?, status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').run(title, slug, content, html || '', css, status, req.params.id);
    res.json({ message: 'Page updated' });
  } catch {
    res.status(400).json({ error: 'Slug already exists' });
  }
});

// Delete page
router.delete('/:id', auth, (req, res) => {
  db.prepare('DELETE FROM pages WHERE id = ?').run(req.params.id);
  res.json({ message: 'Page deleted' });
});

module.exports = router;
