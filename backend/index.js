import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/ganhos', (req, res) => {
  const ganhos = db.prepare('SELECT * FROM ganhos ORDER BY data').all();
  res.json(ganhos);
});

app.post('/ganhos', (req, res) => {
  const { data, valor } = req.body;
  if (!data || typeof valor !== 'number') {
    return res.status(400).json({ error: 'Dados inválidos' });
  }

  const stmt = db.prepare(\`
    INSERT INTO ganhos (data, valor)
    VALUES (?, ?)
    ON CONFLICT(data) DO UPDATE SET valor = excluded.valor
  \`);
  stmt.run(data, valor);
  res.json({ ok: true });
});

app.delete('/ganhos', (req, res) => {
  db.prepare('DELETE FROM ganhos').run();
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(\`🚀 API rodando em http://localhost:\${PORT}\`);
});
