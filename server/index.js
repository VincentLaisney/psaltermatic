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
const { ordinary } = require('./work/ordinary');
app.get('/api/hour/:hour', async (req, res) => {
  try {
    const hour = req.params.hour;
    const lang = (req.query.lang || 'la');
    const date = req.query.date || Date.now();

    const result = await ordinary(date, hour, lang);
    return res.json({ source: 'ordinary', content: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
