const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const auth = require('../middleware/auth');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const unique = uuidv4() + path.extname(file.originalname);
    cb(null, unique);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /^image\/(jpeg|jpg|png|gif|webp|svg\+xml)$/;
    cb(null, allowed.test(file.mimetype));
  }
});

router.get('/', auth, (req, res) => {
  const media = db.prepare('SELECT * FROM media ORDER BY created_at DESC').all();
  res.json(media);
});

router.post('/upload', auth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const id = uuidv4();
  const url = `/uploads/${req.file.filename}`;
  db.prepare('INSERT INTO media (id, filename, original_name, mimetype, size, url) VALUES (?, ?, ?, ?, ?, ?)').run(id, req.file.filename, req.file.originalname, req.file.mimetype, req.file.size, url);
  res.json({ id, url, filename: req.file.filename, original_name: req.file.originalname });
});

router.delete('/:id', auth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Only admins can delete media' });
  const media = db.prepare('SELECT * FROM media WHERE id = ?').get(req.params.id);
  if (!media) return res.status(404).json({ error: 'Not found' });
  const fs = require('fs');
  const filePath = path.join(__dirname, '../uploads', media.filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  db.prepare('DELETE FROM media WHERE id = ?').run(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
