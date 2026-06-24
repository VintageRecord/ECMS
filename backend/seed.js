require('dotenv').config();
if (!process.env.JWT_SECRET) process.env.JWT_SECRET = 'ecms_default_secret_please_change_in_production';

const db = require('./src/database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

console.log('Seeding nature-themed sample website...');

// Clear existing data
db.exec(`
  DELETE FROM pages;
  DELETE FROM settings;
  DELETE FROM users;
`);

// ─── USERS ────────────────────────────────────────────────
db.prepare('INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)').run(
  uuidv4(), 'admin', bcrypt.hashSync('admin123', 10), 'admin'
);
db.prepare('INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)').run(
  uuidv4(), 'editor', bcrypt.hashSync('editor123', 10), 'editor'
);
console.log('✓ Users created  (admin / admin123)  (editor / editor123)');

// ─── SETTINGS ─────────────────────────────────────────────
const upsert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value');

const navLinks = JSON.stringify([
  { label: 'Home', url: '/preview/home' },
  { label: 'About', url: '/preview/about' },
  { label: 'Our Forests', url: '/preview/forests' },
  { label: 'Conservation', url: '/preview/conservation' },
  { label: 'Contact', url: '/preview/contact' },
]);

const footerColumns = JSON.stringify([
  {
    heading: 'Explore',
    links: [
      { label: 'Our Forests', url: '/preview/forests' },
      { label: 'Wildlife', url: '#' },
      { label: 'Conservation', url: '/preview/conservation' },
    ]
  },
  {
    heading: 'Organisation',
    links: [
      { label: 'About Us', url: '/preview/about' },
      { label: 'Our Team', url: '#' },
      { label: 'Contact', url: '/preview/contact' },
    ]
  },
  {
    heading: 'Get Involved',
    links: [
      { label: 'Volunteer', url: '#' },
      { label: 'Donate', url: '#' },
      { label: 'Newsletter', url: '#' },
    ]
  },
]);

upsert.run('nav_logo', 'GreenEarth');
upsert.run('nav_bg_color', '#1a3a2a');
upsert.run('nav_text_color', '#d4edda');
upsert.run('nav_links', navLinks);
upsert.run('footer_text', '© 2024 GreenEarth Conservation. Protecting nature for future generations.');
upsert.run('footer_bg_color', '#0f2318');
upsert.run('footer_text_color', '#a8d5b5');
upsert.run('footer_columns', footerColumns);
console.log('✓ Navigation & footer settings saved');

// ─── PAGES ────────────────────────────────────────────────
const pages = [
  {
    title: 'Home',
    slug: 'home',
    meta_title: 'GreenEarth — Protecting Nature Together',
    meta_description: 'GreenEarth is a nature conservation organisation dedicated to protecting forests, wildlife and ecosystems around the world.',
    html: `
<div style="background:linear-gradient(160deg,#1a3a2a 0%,#2d6a4f 50%,#52b788 100%);min-height:90vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:60px 40px;">
  <div>
    <div style="display:inline-block;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);color:#b7e4c7;padding:8px 20px;border-radius:20px;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:24px;">Nature Conservation</div>
    <h1 style="font-size:56px;font-weight:900;color:white;line-height:1.1;margin-bottom:20px;letter-spacing:-1px;">Protect the Planet.<br/>Restore Nature.</h1>
    <p style="font-size:20px;color:#b7e4c7;max-width:560px;margin:0 auto 40px;line-height:1.7;">We work with communities around the world to conserve forests, protect wildlife, and restore natural ecosystems for generations to come.</p>
    <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
      <a href="/preview/conservation" style="background:#52b788;color:white;padding:16px 36px;border-radius:10px;font-weight:700;font-size:16px;text-decoration:none;">Our Work</a>
      <a href="/preview/about" style="background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.3);color:white;padding:16px 36px;border-radius:10px;font-weight:700;font-size:16px;text-decoration:none;">Learn More</a>
    </div>
  </div>
</div>

<div style="padding:80px 40px;max-width:1100px;margin:0 auto;">
  <div style="text-align:center;margin-bottom:60px;">
    <h2 style="font-size:38px;font-weight:800;color:#1a3a2a;margin-bottom:16px;">Why Nature Needs Us</h2>
    <p style="font-size:17px;color:#555;max-width:580px;margin:0 auto;">Every day, thousands of acres of forest are lost. We're here to stop that.</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:32px;">
    <div style="padding:36px;border-radius:16px;background:#f0faf4;border:1px solid #c3e6cb;text-align:center;">
      <div style="font-size:48px;font-weight:900;color:#2d6a4f;margin-bottom:8px;">3.8B</div>
      <div style="font-weight:700;font-size:16px;color:#1a3a2a;margin-bottom:8px;">Acres Protected</div>
      <p style="color:#555;font-size:14px;line-height:1.7;">Forest land under active conservation programmes globally.</p>
    </div>
    <div style="padding:36px;border-radius:16px;background:#fff8f0;border:1px solid #ffd8a8;text-align:center;">
      <div style="font-size:48px;font-weight:900;color:#e76f51;margin-bottom:8px;">500+</div>
      <div style="font-weight:700;font-size:16px;color:#1a3a2a;margin-bottom:8px;">Species Saved</div>
      <p style="color:#555;font-size:14px;line-height:1.7;">Endangered species brought back from the brink of extinction.</p>
    </div>
    <div style="padding:36px;border-radius:16px;background:#f0f4ff;border:1px solid #c5cae9;text-align:center;">
      <div style="font-size:48px;font-weight:900;color:#3d5a80;margin-bottom:8px;">120</div>
      <div style="font-weight:700;font-size:16px;color:#1a3a2a;margin-bottom:8px;">Countries</div>
      <p style="color:#555;font-size:14px;line-height:1.7;">Active conservation projects running across six continents.</p>
    </div>
  </div>
</div>

<div style="background:#1a3a2a;padding:80px 40px;text-align:center;">
  <h2 style="font-size:36px;font-weight:800;color:white;margin-bottom:16px;">Join the Movement</h2>
  <p style="color:#b7e4c7;font-size:17px;max-width:500px;margin:0 auto 36px;line-height:1.7;">Whether you volunteer, donate or simply spread the word — every action counts.</p>
  <a href="/preview/contact" style="background:#52b788;color:white;padding:14px 40px;border-radius:10px;font-weight:700;font-size:16px;text-decoration:none;">Get Involved Today</a>
</div>`,
  },
  {
    title: 'About Us',
    slug: 'about',
    meta_title: 'About GreenEarth — Our Story & Mission',
    meta_description: 'Learn about GreenEarth, our mission to protect natural ecosystems, and the passionate team behind our conservation work.',
    html: `
<div style="background:linear-gradient(135deg,#1a3a2a,#2d6a4f);padding:80px 40px;text-align:center;">
  <h1 style="font-size:48px;font-weight:900;color:white;margin-bottom:16px;">About GreenEarth</h1>
  <p style="font-size:18px;color:#b7e4c7;max-width:600px;margin:0 auto;">Founded in 1998, we have spent over 25 years fighting to protect the world's most precious natural spaces.</p>
</div>

<div style="max-width:900px;margin:0 auto;padding:80px 40px;">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;margin-bottom:80px;">
    <div>
      <h2 style="font-size:32px;font-weight:800;color:#1a3a2a;margin-bottom:20px;">Our Mission</h2>
      <p style="color:#555;font-size:16px;line-height:1.8;margin-bottom:16px;">GreenEarth exists to protect and restore the natural world. We believe that healthy ecosystems are the foundation of all life on Earth — including our own.</p>
      <p style="color:#555;font-size:16px;line-height:1.8;">Through science-led conservation, community engagement and global partnerships, we work to reverse the damage done to our planet's forests, rivers and wildlife.</p>
    </div>
    <div style="background:#f0faf4;border-radius:16px;padding:40px;border:1px solid #c3e6cb;">
      <h3 style="font-size:20px;font-weight:700;color:#2d6a4f;margin-bottom:20px;">Our Values</h3>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="display:flex;gap:12px;"><div style="width:8px;height:8px;background:#52b788;border-radius:50%;margin-top:7px;flex-shrink:0;"></div><div><strong style="color:#1a3a2a;">Science-led</strong><p style="color:#555;font-size:14px;margin-top:2px;">All our work is grounded in the latest ecological research.</p></div></div>
        <div style="display:flex;gap:12px;"><div style="width:8px;height:8px;background:#52b788;border-radius:50%;margin-top:7px;flex-shrink:0;"></div><div><strong style="color:#1a3a2a;">Community-first</strong><p style="color:#555;font-size:14px;margin-top:2px;">Local communities are central to every conservation project.</p></div></div>
        <div style="display:flex;gap:12px;"><div style="width:8px;height:8px;background:#52b788;border-radius:50%;margin-top:7px;flex-shrink:0;"></div><div><strong style="color:#1a3a2a;">Transparent</strong><p style="color:#555;font-size:14px;margin-top:2px;">We publish full reports on our impact every year.</p></div></div>
      </div>
    </div>
  </div>

  <h2 style="font-size:32px;font-weight:800;color:#1a3a2a;margin-bottom:36px;text-align:center;">Meet the Team</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
    <div style="text-align:center;padding:32px 24px;border:1px solid #e2e8f0;border-radius:14px;">
      <div style="width:80px;height:80px;background:linear-gradient(135deg,#2d6a4f,#52b788);border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;color:white;font-size:28px;font-weight:800;">A</div>
      <h3 style="font-weight:700;font-size:17px;color:#1a3a2a;margin-bottom:4px;">Dr. Amara Osei</h3>
      <p style="color:#52b788;font-size:13px;font-weight:600;margin-bottom:12px;">Executive Director</p>
      <p style="color:#555;font-size:13px;line-height:1.7;">20 years in tropical ecology and forest conservation across West Africa.</p>
    </div>
    <div style="text-align:center;padding:32px 24px;border:1px solid #e2e8f0;border-radius:14px;">
      <div style="width:80px;height:80px;background:linear-gradient(135deg,#e76f51,#f4a261);border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;color:white;font-size:28px;font-weight:800;">L</div>
      <h3 style="font-weight:700;font-size:17px;color:#1a3a2a;margin-bottom:4px;">Lena Brandt</h3>
      <p style="color:#e76f51;font-size:13px;font-weight:600;margin-bottom:12px;">Head of Wildlife</p>
      <p style="color:#555;font-size:13px;line-height:1.7;">Specialist in large mammal conservation and rewilding programmes.</p>
    </div>
    <div style="text-align:center;padding:32px 24px;border:1px solid #e2e8f0;border-radius:14px;">
      <div style="width:80px;height:80px;background:linear-gradient(135deg,#3d5a80,#5b8fb9);border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;color:white;font-size:28px;font-weight:800;">R</div>
      <h3 style="font-weight:700;font-size:17px;color:#1a3a2a;margin-bottom:4px;">Ravi Menon</h3>
      <p style="color:#3d5a80;font-size:13px;font-weight:600;margin-bottom:12px;">Community Lead</p>
      <p style="color:#555;font-size:13px;line-height:1.7;">Works with indigenous communities to develop sustainable land practices.</p>
    </div>
  </div>
</div>`,
  },
  {
    title: 'Our Forests',
    slug: 'forests',
    meta_title: 'Our Forests — GreenEarth Conservation Areas',
    meta_description: 'Explore the forests and natural areas GreenEarth actively protects and restores around the world.',
    html: `
<div style="background:linear-gradient(135deg,#1a3a2a,#2d6a4f);padding:80px 40px;text-align:center;">
  <h1 style="font-size:48px;font-weight:900;color:white;margin-bottom:16px;">Our Forests</h1>
  <p style="font-size:18px;color:#b7e4c7;max-width:600px;margin:0 auto;">From ancient rainforests to coastal mangroves — these are the wild places we protect.</p>
</div>

<div style="max-width:1100px;margin:0 auto;padding:80px 40px;">
  <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:32px;">
    <div style="border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
      <div style="height:220px;background:linear-gradient(135deg,#1a3a2a 0%,#52b788 100%);display:flex;align-items:center;justify-content:center;">
        <div style="text-align:center;color:white;"><div style="font-size:56px;margin-bottom:8px;">🌿</div><div style="font-size:13px;opacity:0.8;text-transform:uppercase;letter-spacing:0.08em;">Amazon Basin</div></div>
      </div>
      <div style="padding:28px;">
        <h3 style="font-size:22px;font-weight:800;color:#1a3a2a;margin-bottom:8px;">Amazon Rainforest</h3>
        <p style="color:#555;font-size:14px;line-height:1.8;margin-bottom:16px;">The world's largest tropical rainforest covering 5.5 million km². Home to 10% of all species on Earth. We support 14 active protection zones across Brazil and Peru.</p>
        <div style="display:flex;gap:16px;"><span style="background:#f0faf4;color:#2d6a4f;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;">Rainforest</span><span style="background:#fff8f0;color:#e76f51;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;">Critical</span></div>
      </div>
    </div>
    <div style="border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
      <div style="height:220px;background:linear-gradient(135deg,#2d4a6a 0%,#5b8fb9 100%);display:flex;align-items:center;justify-content:center;">
        <div style="text-align:center;color:white;"><div style="font-size:56px;margin-bottom:8px;">🌊</div><div style="font-size:13px;opacity:0.8;text-transform:uppercase;letter-spacing:0.08em;">Southeast Asia</div></div>
      </div>
      <div style="padding:28px;">
        <h3 style="font-size:22px;font-weight:800;color:#1a3a2a;margin-bottom:8px;">Borneo Mangroves</h3>
        <p style="color:#555;font-size:14px;line-height:1.8;margin-bottom:16px;">Coastal mangrove forests that protect shorelines, store carbon and provide nursery habitat for hundreds of marine species. Facing severe pressure from development.</p>
        <div style="display:flex;gap:16px;"><span style="background:#f0f4ff;color:#3d5a80;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;">Mangrove</span><span style="background:#fff8f0;color:#e76f51;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;">Endangered</span></div>
      </div>
    </div>
    <div style="border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
      <div style="height:220px;background:linear-gradient(135deg,#4a3728 0%,#9b7653 100%);display:flex;align-items:center;justify-content:center;">
        <div style="text-align:center;color:white;"><div style="font-size:56px;margin-bottom:8px;">🦁</div><div style="font-size:13px;opacity:0.8;text-transform:uppercase;letter-spacing:0.08em;">East Africa</div></div>
      </div>
      <div style="padding:28px;">
        <h3 style="font-size:22px;font-weight:800;color:#1a3a2a;margin-bottom:8px;">African Savanna</h3>
        <p style="color:#555;font-size:14px;line-height:1.8;margin-bottom:16px;">The great savannas of East Africa support the largest wildlife migrations on the planet. We work to protect migration corridors threatened by agriculture expansion.</p>
        <div style="display:flex;gap:16px;"><span style="background:#fffbeb;color:#92400e;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;">Savanna</span><span style="background:#f0faf4;color:#2d6a4f;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;">Protected</span></div>
      </div>
    </div>
    <div style="border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
      <div style="height:220px;background:linear-gradient(135deg,#1a2a3a 0%,#3d7a8a 100%);display:flex;align-items:center;justify-content:center;">
        <div style="text-align:center;color:white;"><div style="font-size:56px;margin-bottom:8px;">❄️</div><div style="font-size:13px;opacity:0.8;text-transform:uppercase;letter-spacing:0.08em;">Scandinavia</div></div>
      </div>
      <div style="padding:28px;">
        <h3 style="font-size:22px;font-weight:800;color:#1a3a2a;margin-bottom:8px;">Nordic Boreal Forest</h3>
        <p style="color:#555;font-size:14px;line-height:1.8;margin-bottom:16px;">The vast boreal forests of Scandinavia are the lungs of Europe. Ancient pine and spruce forests that store enormous amounts of carbon and shelter wolves, lynx and bears.</p>
        <div style="display:flex;gap:16px;"><span style="background:#f0f4ff;color:#3d5a80;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;">Boreal</span><span style="background:#f0faf4;color:#2d6a4f;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;">Monitored</span></div>
      </div>
    </div>
  </div>
</div>`,
  },
  {
    title: 'Conservation',
    slug: 'conservation',
    meta_title: 'Conservation Work — GreenEarth',
    meta_description: 'Discover how GreenEarth approaches conservation through science, community partnerships and restoration projects.',
    html: `
<div style="background:linear-gradient(135deg,#1a3a2a,#2d6a4f);padding:80px 40px;text-align:center;">
  <h1 style="font-size:48px;font-weight:900;color:white;margin-bottom:16px;">Our Conservation Work</h1>
  <p style="font-size:18px;color:#b7e4c7;max-width:600px;margin:0 auto;">Three pillars that guide everything we do.</p>
</div>

<div style="max-width:1000px;margin:0 auto;padding:80px 40px;">
  <div style="display:flex;flex-direction:column;gap:60px;">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;">
      <div style="background:linear-gradient(135deg,#f0faf4,#d8f3dc);border-radius:16px;height:280px;display:flex;align-items:center;justify-content:center;font-size:80px;">🌱</div>
      <div>
        <div style="color:#52b788;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px;">Pillar One</div>
        <h2 style="font-size:28px;font-weight:800;color:#1a3a2a;margin-bottom:16px;">Habitat Restoration</h2>
        <p style="color:#555;font-size:16px;line-height:1.8;margin-bottom:16px;">We replant native trees, remove invasive species and restore degraded land back to thriving ecosystems. Since 2005, we have restored over 2 million acres of habitat.</p>
        <p style="color:#555;font-size:16px;line-height:1.8;">Our restoration teams work alongside local communities, training them in sustainable land management so the work continues long after our projects end.</p>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;">
      <div>
        <div style="color:#e76f51;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px;">Pillar Two</div>
        <h2 style="font-size:28px;font-weight:800;color:#1a3a2a;margin-bottom:16px;">Wildlife Protection</h2>
        <p style="color:#555;font-size:16px;line-height:1.8;margin-bottom:16px;">Anti-poaching patrols, wildlife corridors, and species monitoring programmes protect endangered animals across our conservation areas.</p>
        <p style="color:#555;font-size:16px;line-height:1.8;">We use camera traps, satellite tracking and community rangers to monitor populations and respond to threats in real time.</p>
      </div>
      <div style="background:linear-gradient(135deg,#fff3e0,#ffe0b2);border-radius:16px;height:280px;display:flex;align-items:center;justify-content:center;font-size:80px;">🦅</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;">
      <div style="background:linear-gradient(135deg,#e8f4f8,#b3d9e8);border-radius:16px;height:280px;display:flex;align-items:center;justify-content:center;font-size:80px;">🤝</div>
      <div>
        <div style="color:#3d5a80;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px;">Pillar Three</div>
        <h2 style="font-size:28px;font-weight:800;color:#1a3a2a;margin-bottom:16px;">Community Partnerships</h2>
        <p style="color:#555;font-size:16px;line-height:1.8;margin-bottom:16px;">Conservation only works when local people benefit from protecting nature. We create sustainable livelihoods through eco-tourism, sustainable forestry and carbon credits.</p>
        <p style="color:#555;font-size:16px;line-height:1.8;">Over 40,000 people across our project areas now earn income through conservation-linked activities.</p>
      </div>
    </div>
  </div>
</div>`,
  },
  {
    title: 'Contact',
    slug: 'contact',
    meta_title: 'Contact GreenEarth — Get in Touch',
    meta_description: 'Contact the GreenEarth team to learn more about our work, volunteer, donate or partner with us.',
    html: `
<div style="background:linear-gradient(135deg,#1a3a2a,#2d6a4f);padding:80px 40px;text-align:center;">
  <h1 style="font-size:48px;font-weight:900;color:white;margin-bottom:16px;">Contact Us</h1>
  <p style="font-size:18px;color:#b7e4c7;max-width:600px;margin:0 auto;">We'd love to hear from you — whether you want to volunteer, donate, partner or just learn more.</p>
</div>

<div style="max-width:900px;margin:0 auto;padding:80px 40px;">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:60px;">
    <div>
      <h2 style="font-size:26px;font-weight:800;color:#1a3a2a;margin-bottom:32px;">Get in Touch</h2>
      <div style="display:flex;flex-direction:column;gap:28px;">
        <div style="display:flex;gap:20px;align-items:flex-start;">
          <div style="width:48px;height:48px;background:#f0faf4;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid #c3e6cb;color:#2d6a4f;font-size:20px;font-weight:700;">@</div>
          <div><p style="font-weight:700;color:#1a3a2a;margin-bottom:4px;">Email</p><p style="color:#555;font-size:14px;">hello@greenearth.org</p><p style="color:#555;font-size:14px;">press@greenearth.org</p></div>
        </div>
        <div style="display:flex;gap:20px;align-items:flex-start;">
          <div style="width:48px;height:48px;background:#fff8f0;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid #ffd8a8;color:#e76f51;font-size:20px;font-weight:700;">#</div>
          <div><p style="font-weight:700;color:#1a3a2a;margin-bottom:4px;">Phone</p><p style="color:#555;font-size:14px;">+1 (555) 234-5678</p><p style="color:#555;font-size:14px;">Mon–Fri, 9am–5pm GMT</p></div>
        </div>
        <div style="display:flex;gap:20px;align-items:flex-start;">
          <div style="width:48px;height:48px;background:#f0f4ff;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid #c5cae9;color:#3d5a80;font-size:20px;font-weight:700;">P</div>
          <div><p style="font-weight:700;color:#1a3a2a;margin-bottom:4px;">Head Office</p><p style="color:#555;font-size:14px;">14 Forest Lane<br/>London, EC1A 4BD<br/>United Kingdom</p></div>
        </div>
      </div>
    </div>
    <div style="background:#f8fffe;border:1px solid #c3e6cb;border-radius:16px;padding:36px;">
      <h3 style="font-size:18px;font-weight:700;color:#1a3a2a;margin-bottom:24px;">Send a Message</h3>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div><p style="font-size:13px;font-weight:600;color:#555;margin-bottom:6px;">Your Name</p><div style="background:white;border:1px solid #d0e8d4;border-radius:8px;padding:10px 14px;color:#94a3b8;font-size:14px;">Enter your full name</div></div>
        <div><p style="font-size:13px;font-weight:600;color:#555;margin-bottom:6px;">Email Address</p><div style="background:white;border:1px solid #d0e8d4;border-radius:8px;padding:10px 14px;color:#94a3b8;font-size:14px;">your@email.com</div></div>
        <div><p style="font-size:13px;font-weight:600;color:#555;margin-bottom:6px;">How can we help?</p>
          <div style="background:white;border:1px solid #d0e8d4;border-radius:8px;padding:10px 14px;color:#94a3b8;font-size:14px;">Volunteer / Donate / Partner / Other</div></div>
        <div><p style="font-size:13px;font-weight:600;color:#555;margin-bottom:6px;">Message</p><div style="background:white;border:1px solid #d0e8d4;border-radius:8px;padding:10px 14px;color:#94a3b8;font-size:14px;min-height:90px;">Tell us more...</div></div>
        <div style="background:#2d6a4f;color:white;padding:12px;border-radius:8px;text-align:center;font-weight:700;cursor:pointer;font-size:15px;margin-top:4px;">Send Message</div>
      </div>
    </div>
  </div>
</div>`,
  },
];

const insertPage = db.prepare('INSERT INTO pages (id, title, slug, content, html, css, meta_title, meta_description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
for (const page of pages) {
  insertPage.run(uuidv4(), page.title, page.slug, '{}', page.html, '', page.meta_title, page.meta_description, 'published');
  console.log(`✓ Page created: ${page.title} → /preview/${page.slug}`);
}

console.log('\nSeed complete! Sample nature website is ready.');
console.log('\nLogin credentials:');
console.log('  Admin  → username: admin    password: admin123');
console.log('  Editor → username: editor   password: editor123');
console.log('\nSample pages:');
pages.forEach(p => console.log(`  http://localhost:3000/preview/${p.slug}`));
