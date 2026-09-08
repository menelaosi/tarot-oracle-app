// Side-effect import: loads .env into process.env. Must stay first so every
// module below sees the vars when it initializes (db pool, Anthropic client).
import './env.js';
import app from './app.js';

const port = Number(process.env.PORT ?? 3001);

app.listen(port, () => {
  console.log(`Tarot API listening on http://localhost:${port}`);
});
