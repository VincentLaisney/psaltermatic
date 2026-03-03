# The Backend server of Psaltermatic

## Server setup

1. cd server
2. npm install
3. Create a `.env` file with DB credentials (optional):

```bash
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=secret
DB_NAME=psaltermatic
PORT=3000
```

4. Fill the DB with the data from the file `psaltermatic.sql`. You can change/add the DB name:

```bash
mysql -u admin -p < psaltermatic.sql
```

5. Start server:

```bash
npm run dev
```

## Security & API key

- You must protect the API by setting a shared secret on the server. In `server/.env` set:

```bash
API_SECRET=your-server-secret
```

- If `API_SECRET` is set, the server will require a header `X-PSALT-KEY` with the same value for `/api/*` routes (except `/api/health` and `/api/set-cookie`). Requests without the header receive 401.

- Frontend usage: if you want the frontend to automatically send the key, build-time set a Vite environment variable `VITE_API_KEY` to the same secret and the frontend will include it in the `X-PSALT-KEY` header for requests. Example when running the dev server:

```bash
VITE_API_KEY=your-server-secret API_SECRET=your-server-secret npm run dev -- --host
```
