const express = require('express');
const cors = require('cors');
const checklist = require('./routes/analise');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ status: 'ok', mensagem: 'Servidor webhook ativo para análise de conversas.' });
});

app.post('/conversa', (req, res) => {
    const resultado = checklist(req.body);
    res.json(resultado);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});