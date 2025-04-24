const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  const { cliente, vendedor, checklist } = req.body;

  if (!cliente || !vendedor || !checklist) {
    return res.status(400).json({ status: 'erro', mensagem: 'Dados incompletos na requisição.' });
  }

  const pendencias = Object.entries(checklist)
    .filter(([_, ok]) => !ok)
    .map(([item]) => `⚠️ Falta confirmar: ${item}`);

  const status = pendencias.length ? 'incompleto' : 'completo';

  const payload = {
    cliente,
    vendedor,
    checklist,
    status,
    alertas: pendencias,
    sugestao: pendencias.length ? 'Recomenda-se validar os pontos pendentes antes de seguir com o pedido.' : 'Checklist completo. Pronto para prosseguir.'
  };

  try {
    const endpoint = 'https://cbm-wap-babysuri-cb39727892-lumie.azurewebsites.net/api/messages';
    const token = 'c3b5eca4-707f-46df-852c-7ad6790d61f9';

    await axios.post(endpoint, {
      destination: '554731703288', // teste
      message: `🟡 Alerta: atendimento com pendência!
Cliente: ${cliente}
Vendedor: ${vendedor}

${payload.alertas.join('
')}

${payload.sugestao}`
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res.json({ status: 'ok', enviado: true });
  } catch (error) {
    return res.status(500).json({ status: 'erro', enviado: false, erro: error.message });
  }
});

module.exports = router;