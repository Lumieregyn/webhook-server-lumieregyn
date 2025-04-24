const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const analiseRoute = require('./routes/analise');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json({ status: 'ok', mensagem: 'Servidor webhook ativo para análise de conversas.' });
});

app.use('/conversa', analiseRoute);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
