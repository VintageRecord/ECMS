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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/pages', require('./routes/pages'));
app.use('/api/media', require('./routes/media'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/users', require('./routes/users'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`CMS Backend running on http://localhost:${PORT}`));
