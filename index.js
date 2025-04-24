const express = require('express');
const cors = require('cors');
const analise = require('./routes/analise');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', mensagem: 'Servidor webhook ativo para análise de conversas.' });
});

app.post('/conversa', analise);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
