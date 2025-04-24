
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const API_URL = 'https://cbm-wap-babysuri-cb39727892-lumie.azurewebsites.net/api';
const TOKEN = 'c3b5eca4-707f-46df-852c-7ad6790d61f9';

app.post('/conversa', async (req, res) => {
  const { cliente, vendedor, checklist, alertas } = req.body;

  const texto = `🚨 *Alerta de Atendimento Incompleto* 🚨\n
*Cliente:* ${cliente}\n
*Vendedor:* ${vendedor}\n
${alertas.map(item => '- ' + item).join('\n')}
`;

  try {
    await axios.post(\`\${API_URL}/message/send-text\`, {
      number: '554731703288',
      text: texto
    }, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({ status: 'ok', enviado: true });
  } catch (err) {
    res.json({
      status: 'erro',
      enviado: false,
      erro: err.message
    });
  }
});

app.get('/', (req, res) => {
  res.send('Servidor ativo!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
