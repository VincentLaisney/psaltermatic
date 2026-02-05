const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');
const data = require('./data');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Simple health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Return available hours (keys of data)
app.get('/api/hours', (req, res) => {
  res.json(Object.keys(data));
});

// Return liturgy for a given date (YYYY-MM-DD)
app.get('/api/liturgy', (req, res) => {
  try {
    const date = req.query.date;
    if (!date) return res.status(400).json({ error: 'date query param required' });
    return res.json({ asText: `De ea. 4ᵉ semaine du Temps ordinaire` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// Return hour content. Query param lang=fr|la (default la)
app.get('/api/hour/:key', async (req, res) => {
  try {
    const key = req.params.key;
    const name = decodeURIComponent(key);
    const lang = (req.query.lang || 'la');

    // Try DB first (if a table `hours` exists), fallback to in-memory data
    try {
      const rows = await db.query('SELECT content FROM hours WHERE name = ? AND lang = ?', [name, lang]);
      if (rows && rows.length) {
        return res.json({ source: 'db', content: rows[0].content });
      }
    } catch (e) {
      // ignore DB errors and fallback
      console.warn('DB lookup failed, using in-memory data', e.message);
    }

    const hour = data[name];
    if (!hour) return res.status(404).json({ error: 'Hour not found' });
    const payload = hour[lang] || hour.la;
    return res.json({ source: 'memory', content: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
