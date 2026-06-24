require('dotenv').config();
if (!process.env.JWT_SECRET) process.env.JWT_SECRET = 'ecms_default_secret_please_change_in_production';

const db = require('./src/database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

console.log('Seeding nature-themed sample website (Environs template)...');

// Clear existing data
db.exec(`
  DELETE FROM pages;
  DELETE FROM settings;
  DELETE FROM users;
  DELETE FROM media;
`);

// ─── USERS ────────────────────────────────────────────────
db.prepare('INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)').run(
  uuidv4(), 'admin', bcrypt.hashSync('admin123', 10), 'admin'
);
db.prepare('INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)').run(
  uuidv4(), 'editor', bcrypt.hashSync('editor123', 10), 'editor'
);
console.log('✓ Users created  (admin / admin123)  (editor / editor123)');

// ─── REGISTER UPLOADED IMAGES IN MEDIA TABLE ──────────────
const uploadsDir = path.join(__dirname, 'uploads');
if (fs.existsSync(uploadsDir)) {
  const images = fs.readdirSync(uploadsDir).filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
  const insertMedia = db.prepare('INSERT INTO media (id, filename, original_name, mimetype, size, url) VALUES (?, ?, ?, ?, ?, ?)');
  for (const img of images) {
    const stat = fs.statSync(path.join(uploadsDir, img));
    insertMedia.run(uuidv4(), img, img, 'image/jpeg', stat.size, `/uploads/${img}`);
  }
  console.log(`✓ Registered ${images.length} images in media library`);
}

// ─── SETTINGS ─────────────────────────────────────────────
const upsert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value');

const navLinks = JSON.stringify([
  { label: 'Home', url: '/preview/home' },
  { label: 'About', url: '/preview/about' },
  { label: 'Services', url: '/preview/service' },
  { label: 'Causes', url: '/preview/causes' },
  { label: 'Contact', url: '/preview/contact' },
]);

const footerColumns = JSON.stringify([
  {
    heading: 'Explore',
    links: [
      { label: 'About Us', url: '/preview/about' },
      { label: 'Our Services', url: '/preview/service' },
      { label: 'Our Causes', url: '/preview/causes' },
    ]
  },
  {
    heading: 'Get Involved',
    links: [
      { label: 'Volunteer', url: '#' },
      { label: 'Donate Now', url: '#' },
      { label: 'Contact Us', url: '/preview/contact' },
    ]
  },
  {
    heading: 'Contact',
    links: [
      { label: 'Example@gmail.com', url: '#' },
      { label: '+01234567890', url: '#' },
      { label: '123 Green St, Nature City', url: '#' },
    ]
  },
]);

upsert.run('nav_logo', 'Environs');
upsert.run('nav_bg_color', '#ffffff');
upsert.run('nav_text_color', '#F8B864');
upsert.run('nav_links', navLinks);
upsert.run('footer_text', '© 2024 Environs. All Rights Reserved. Environmental & Nature Conservation.');
upsert.run('footer_bg_color', '#222222');
upsert.run('footer_text_color', '#F3E0C6');
upsert.run('footer_columns', footerColumns);
console.log('✓ Navigation & footer settings saved');

// ─── SHARED ASSETS (CDN links + CSS) ──────────────────────
const CDN_LINKS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@500;600&family=Roboto&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"><\/script>`;

// Read the template CSS and patch image paths + Bootstrap colour overrides
let templateCSS = '';
const cssPath = path.join(__dirname, '../..', '/tmp/nature-template/nature-website-template/css/style.css');
if (fs.existsSync(cssPath)) {
  templateCSS = fs.readFileSync(cssPath, 'utf8').replace(/url\(\.\.\/img\//g, 'url(/uploads/');
}

const PAGE_CSS = `:root {
  --bs-primary: #F8B864;
  --bs-secondary: #F3E0C6;
  --bs-light: #F2F2F2;
  --bs-dark: #222222;
}
.text-primary { color: #F8B864 !important; }
.bg-primary { background-color: #F8B864 !important; }
.btn-primary { background-color: #F8B864 !important; border-color: #F8B864 !important; color: #fff !important; }
.btn-primary:hover { background-color: #F3E0C6 !important; border-color: #F3E0C6 !important; color: #222 !important; }
.bg-secondary { background-color: #F3E0C6 !important; }
.text-secondary { color: #F3E0C6 !important; }
h1,h2,h3,h4,h5,h6 { font-family: "Jost", sans-serif; }
body { font-family: "Roboto", sans-serif; }
${templateCSS}`;

// ─── HELPER: extract main content from a template HTML file ──
function extractContent(filename) {
  const filepath = path.join('/tmp/nature-template/nature-website-template', filename);
  if (!fs.existsSync(filepath)) return '<p>Content not found</p>';
  const content = fs.readFileSync(filepath, 'utf8');
  const lines = content.split('\n');

  let navbarEndLine = -1, footerStartLine = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<!-- Navbar End -->')) navbarEndLine = i;
    if (lines[i].includes('<!-- Footer Start -->')) { footerStartLine = i; break; }
  }
  if (navbarEndLine === -1 || footerStartLine === -1) return '<p>Parse error</p>';

  let html = lines.slice(navbarEndLine + 1, footerStartLine).join('\n');

  // Fix image paths
  html = html.replace(/src="img\//g, 'src="/uploads/');
  html = html.replace(/url\(img\//g, 'url(/uploads/');

  // Fix internal page links
  const linkMap = {
    'index.html': '/preview/home',
    'about.html': '/preview/about',
    'service.html': '/preview/service',
    'causes.html': '/preview/causes',
    'contact.html': '/preview/contact',
    'events.html': '/preview/home',
    'blog.html': '/preview/home',
    'gallery.html': '/preview/home',
    'volunteer.html': '/preview/home',
    'donation.html': '/preview/home',
  };
  for (const [orig, repl] of Object.entries(linkMap)) {
    html = html.replace(new RegExp(`href="${orig}"`, 'g'), `href="${repl}"`);
  }

  return CDN_LINKS + '\n' + html;
}

// ─── PAGES ────────────────────────────────────────────────
const pages = [
  {
    title: 'Home',
    slug: 'home',
    meta_title: 'Environs — Environmental & Nature Conservation',
    meta_description: 'Environs is dedicated to protecting and restoring the natural world through conservation, community action and sustainable practices.',
    filename: 'index.html',
  },
  {
    title: 'About Us',
    slug: 'about',
    meta_title: 'About Environs — Our Story & Mission',
    meta_description: 'Learn about Environs, our mission to protect natural ecosystems and the team behind our conservation work.',
    filename: 'about.html',
  },
  {
    title: 'Services',
    slug: 'service',
    meta_title: 'Our Services — Environs Conservation',
    meta_description: 'Discover the environmental and conservation services Environs provides to communities and ecosystems worldwide.',
    filename: 'service.html',
  },
  {
    title: 'Our Causes',
    slug: 'causes',
    meta_title: 'Our Causes — Environs Conservation',
    meta_description: 'Explore the causes Environs fights for: protecting forests, wildlife, clean water and sustainable communities.',
    filename: 'causes.html',
  },
  {
    title: 'Contact',
    slug: 'contact',
    meta_title: 'Contact Environs — Get in Touch',
    meta_description: 'Contact the Environs team to learn more about our work, volunteer, donate or partner with us.',
    filename: 'contact.html',
  },
];

const insertPage = db.prepare('INSERT INTO pages (id, title, slug, content, html, css, meta_title, meta_description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
for (const page of pages) {
  const html = extractContent(page.filename);
  insertPage.run(uuidv4(), page.title, page.slug, '{}', html, PAGE_CSS, page.meta_title, page.meta_description, 'published');
  console.log(`✓ Page created: ${page.title} → /preview/${page.slug}  (${html.length} chars)`);
}

console.log('\nSeed complete! Environs nature website is ready.');
console.log('\nLogin credentials:');
console.log('  Admin  → username: admin    password: admin123');
console.log('  Editor → username: editor   password: editor123');
console.log('\nSample pages:');
pages.forEach(p => console.log(`  http://localhost:3000/preview/${p.slug}`));
