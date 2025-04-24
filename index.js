const express = require('express');
const cors = require('cors');
const app = express();
const analiseRoute = require('./routes/analise');

app.use(cors());
app.use(express.json());

// Health check endpoint
debugger;
app.get('/', (req, res) => {
  res.json({ status: 'ok', mensagem: 'Servidor webhook ativo para análise de conversas.' });
});

// Rota de análise de conversas
app.use('/conversa', analiseRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
