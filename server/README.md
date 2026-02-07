Server setup

1. cd server
2. npm install
3. Create a `.env` file with DB credentials (optional):

```
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=secret
DB_NAME=psaltermatic
PORT=3000
```

4. Start server:

```
npm run dev
```

Notes:

- The server will attempt to read hour content from a `hours` table if it exists. If not, it falls back to the bundled `data.js`.
- To store content in MySQL, create a table like:

```
CREATE DATABASE psaltermatic;
```

```
CREATE TABLE hours (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  lang VARCHAR(10) NOT NULL,
  content JSON NOT NULL,
  UNIQUE KEY (name, lang)
);
```

Insert example (content as JSON):

```
INSERT INTO hours (name, lang, content) VALUES (
  'Dom_sext', 'la', JSON_OBJECT('hymne', 'ant_2', 'antiphon', 'ant_3', 'ps1', 'ant_2','ps2', 'ant_2','ps3', 'ant_2','capit', 'ant_2','vers', 'ant_2','oratio', 'ant_2')
);
INSERT INTO hours (name, lang, content) VALUES (
  'Com_com', 'la', JSON_OBJECT('initial_verset', 'ant_1', 'kyrie', 'ant_2', 'pater', 'ant_3', 'pater_silent', 'ant_2','dominus', 'ant_2', 'benedicamus', 'ant_2','fidelium_animae', 'ant_2','divinum', 'ant_2')
);

Security & API key

- You can protect the API by setting a shared secret on the server. In `server/.env` set:

```
API_SECRET=your-server-secret
```

- If `API_SECRET` is set, the server will require a header `X-PSALT-KEY` with the same value for `/api/*` routes (except `/api/health` and `/api/set-cookie`). Requests without the header receive 401.

- Frontend usage: if you want the frontend to automatically send the key, build-time set a Vite environment variable `VITE_API_KEY` to the same secret and the frontend will include it in the `X-PSALT-KEY` header for requests. Example when running the dev server:

```
VITE_API_KEY=your-server-secret API_SECRET=your-server-secret npm run dev -- --host
```

- WARNING: embedding a secret in frontend code is inherently insecure: anyone can view the built JS and extract the key. This approach will deter casual scrapers, but cannot stop a determined attacker. For stronger protection consider server-side methods (API tokens issued from a trusted server, rate-limiting, IP restrictions, or requiring signed requests).

CORS and cookies

- To restrict origins you can set `CORS_ORIGINS` in `.env` as a comma-separated list of allowed origins. If unset, the server reflects the request origin and allows it.

```
CORS_ORIGINS=http://localhost:5173,http://192.168.1.10:5173
```

```
