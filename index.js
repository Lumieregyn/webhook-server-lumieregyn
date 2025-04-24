const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Servidor Ativo – Webhook Lumieregyn + SURI');
});

app.post('/conversa', async (req, res) => {
  try {
    const dados = req.body;
    const { cliente, vendedor, checklist, alertas } = dados;

    let texto = `🚨 *Alerta de Atendimento Incompleto* 🚨\n\n`;
    texto += `👤 *Cliente:* ${cliente}\n👩‍💼 *Vendedor:* ${vendedor}\n\n`;

    alertas.forEach((a) => {
      texto += `⚠️ ${a}\n`;
    });

    texto += `\n👉 Por favor, revise os pontos pendentes antes de fechar o pedido.`;

    const resposta = await axios.post('https://v3.suri.ai/message/send-text', {
      number: '554731703288',
      text: texto
    }, {
      headers: {
        Authorization: `Bearer ${process.env.SURI_TOKEN}`
      }
    });

    return res.json({
      status: 'ok',
      enviado_para_suri: true,
      retorno_suri: resposta.data
    });

  } catch (error) {
    console.error('Erro ao processar conversa ou enviar para SURI:', error.response?.data || error.message);
    return res.status(500).json({
      status: 'erro',
      erro: error.message,
      detalhes: error.response?.data || null
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});