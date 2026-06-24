require('dotenv').config();

// Fallback defaults if .env is not loaded correctly
if (!process.env.JWT_SECRET) process.env.JWT_SECRET = 'ecms_default_secret_please_change_in_production';
if (!process.env.PORT) process.env.PORT = '5000';
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/pages', require('./routes/pages'));
app.use('/api/media', require('./routes/media'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/users', require('./routes/users'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Serve preview pages as real standalone HTML (bypasses React/iframe rendering issues)
const db = require('./database');
app.get('/preview/:slug', (req, res) => {
  const page = db.prepare('SELECT * FROM pages WHERE slug = ? AND status = ?').get(req.params.slug, 'published');
  if (!page) return res.status(404).send('<!DOCTYPE html><html><body><h1>404 - Page not found</h1></body></html>');

  // Move <link> and external <script src> tags from body into <head>
  const headTags = [];
  const bodyHtml = (page.html || '')
    .replace(/<link\s[^>]*>/gi, m => { headTags.push(m); return ''; })
    .replace(/<script\s[^>]*src=[^>]*><\/script>/gi, m => { headTags.push(m); return ''; });

  const safeTitle = (page.title || '').replace(/'/g, "\\'");
  const editBar = '<script>\n(function(){\n  if (!localStorage.getItem(\'token\')) return;\n  var bar = document.createElement(\'div\');\n  bar.style.cssText = \'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#0f172a;color:white;padding:10px 20px;border-radius:12px;z-index:99999;display:flex;align-items:center;gap:12px;box-shadow:0 8px 32px rgba(0,0,0,0.4);font-family:system-ui,sans-serif;font-size:13px;border:1px solid rgba(255,255,255,0.08)\';\n  bar.innerHTML = \'<span style="color:#94a3b8;padding-right:12px;border-right:1px solid rgba(255,255,255,0.1)">' + safeTitle + '</span><a href="/pages/edit/' + page.id + '" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;padding:7px 16px;border-radius:8px;text-decoration:none;font-weight:700">Edit Page</a><a href="/" style="color:#94a3b8;padding:7px 14px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:8px;text-decoration:none">Dashboard</a>\';\n  document.body.appendChild(bar);\n})();\n</script>';

  res.send('<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>' + (page.meta_title || page.title) + '</title>\n' + headTags.join('\n') + '\n<style>' + (page.css || '') + '</style>\n</head>\n<body style="margin:0;padding:0;">\n' + bodyHtml + '\n' + editBar + '\n</body>\n</html>');
});

// Serve built frontend
const frontendDist = path.join(__dirname, '..', '..', 'frontend', 'dist');
if (require('fs').existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`CMS running on http://0.0.0.0:${PORT}`));
