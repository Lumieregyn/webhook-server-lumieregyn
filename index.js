// backend-crm/index.js

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

// Middlewares compatíveis com todos os tipos de body
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Armazenar logs de requisições webhook
let logs = [];

// Health check
app.get('/', (req, res) => {
  res.status(200).send('Servidor ativo!');
});

// Webhook principal
app.post('/webhook', (req, res) => {
  const log = {
    timestamp: new Date().toISOString(),
    headers: req.headers,
    body: req.body
  };

  logs.push(log);
  console.log('📡 Webhook recebido:', log);

  res.status(200).json({ status: 'ok' });
});

// Logs visíveis pela web
app.get('/logs', (req, res) => {
  res.json(logs.slice(-10));
});

app.listen(PORT, () => {
  console.log(`🚀 Backend CRM rodando na porta ${PORT}`);
});
