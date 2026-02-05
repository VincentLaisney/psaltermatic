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
  'Dom_sext', 'la', JSON_OBJECT('hymne', 'ant_2', 'antiphon', 'ant_3', 'ps1', 'ant_2','ps2', 'ant_2','ps3', 'ant_2','capit', 'ant_2','vers', 'ant_2','oratio')
);
INSERT INTO hours (name, lang, content) VALUES (
  'Com_com', 'la', JSON_OBJECT('initial_verset', 'ant_1', 'kyrie', 'ant_2', 'pater', 'ant_3', 'pater_silent', 'ant_2','dominus', 'ant_2', 'benedicamus', 'ant_2','fidelium_animae', 'ant_2','divinum', 'ant_2')
);
```
