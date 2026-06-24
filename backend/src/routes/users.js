const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const auth = require('../middleware/auth');

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
};

// List all users
router.get('/', auth, adminOnly, (req, res) => {
  const users = db.prepare('SELECT id, username, role, created_at FROM users').all();
  res.json(users);
});

// Create user
router.post('/', auth, adminOnly, (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  const hashed = bcrypt.hashSync(password, 10);
  try {
    const id = uuidv4();
    db.prepare('INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)').run(id, username, hashed, role || 'editor');
    res.json({ id, message: 'User created' });
  } catch {
    res.status(400).json({ error: 'Username already exists' });
  }
});

// Update user role
router.put('/:id', auth, adminOnly, (req, res) => {
  const { role } = req.body;
  if (!['admin', 'editor'].includes(role)) return res.status(400).json({ error: 'Role must be admin or editor' });
  db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, req.params.id);
  res.json({ message: 'User updated' });
});

// Delete user
router.delete('/:id', auth, adminOnly, (req, res) => {
  if (req.params.id === req.user.id) return res.status(400).json({ error: 'Cannot delete your own account' });
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json({ message: 'User deleted' });
});

module.exports = router;
