const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');
const data = require('./data');

dotenv.config();

const app = express();

// Configure CORS to allow LAN access and preflight for non-simple requests.
// Use environment variable CORS_ORIGINS to restrict allowed origins (comma-separated).
const allowedOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').map(s=>s.trim()) : null;
const corsOptions = {
  origin: function(origin, callback) {
    // if no origin (e.g., curl, same-origin) allow
    if (!origin) return callback(null, true);
    if (!allowedOrigins) {
      // reflect origin when no whitelist provided
      return callback(null, true);
    }
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  // enable credentials so browsers will attach cookies on cross-origin requests
  credentials: true,
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With', 'Accept']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // enable preflight
app.use(express.json());

// API key middleware: when API_SECRET is set in env, require X-PSALT-KEY header on API calls.
function requireApiKey(req, res, next) {
  const secret = process.env.API_SECRET;
  if (!secret) return next(); // no secret configured => open

  // allow simple health check and cookie endpoint without key
  if (req.path === '/health' || req.path === '/set-cookie') return next();

  const key = req.get('X-PSALT-KEY') || req.query.api_key || req.headers['x-psalt-key'];
  if (key && key === secret) return next();
  res.status(401).json({ error: 'API key required' });
}

// mount middleware for API routes (it will run for /api/*)
app.use('/api', requireApiKey);

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

// Set a test cookie. Cookie options depend on env: set COOKIE_SECURE=true for SameSite=None; Secure.
app.get('/api/set-cookie', (req, res) => {
  const secure = process.env.COOKIE_SECURE === 'true';
  const cookieOptions = {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  };
  if (secure) {
    cookieOptions.sameSite = 'None';
    cookieOptions.secure = true;
  } else {
    cookieOptions.sameSite = 'Lax';
    cookieOptions.secure = false;
  }
  res.cookie('psaltermatic_session', '1', cookieOptions);
  res.json({ ok: true, cookie: cookieOptions });
});

// Listen on all interfaces so LAN machines can reach this server
app.listen(PORT, '0.0.0.0', () => console.log(`Server listening on ${PORT} (0.0.0.0)`));
