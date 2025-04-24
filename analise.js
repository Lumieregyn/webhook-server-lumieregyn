const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  const { cliente, vendedor, checklist } = req.body;

  if (!cliente || !vendedor || typeof checklist !== 'object') {
    return res.status(400).json({ status: 'erro', mensagem: 'Campos obrigatórios ausentes.' });
  }

  // Monta lista de itens pendentes
  const pendentes = [];
  for (const [campo, ok] of Object.entries(checklist)) {
    if (!ok) pendentes.push(`⚠️ Falta confirmar: ${campo}`);
  }

  const payload = {
    cliente,
    vendedor,
    status: pendentes.length ? 'incompleto' : 'completo',
    alertas: pendentes,
    sugestao: pendentes.length
      ? 'Recomenda-se validar os pontos pendentes antes de seguir com o pedido.'
      : 'Checklist completo! Pode prosseguir com segurança.'
  };

  // Envio via API SURI
  try {
    const endpoint = 'https://cbm-wap-babysuri-cb39727892-lumie.azurewebsites.net/api/messages';
    const token = process.env.SURI_TOKEN || 'c3b5eca4-707f-46df-852c-7ad6790d61f9';

    await axios.post(endpoint, {
      destination: req.query.destino || '554731703288',
      message: `🟡 Alerta de atendimento:\nCliente: ${cliente}\nVendedor: ${vendedor}\n\n${payload.alertas.join('\n')}\n\n${payload.sugestao}`
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return res.json({ ...payload, enviado: true });
  } catch (err) {
    return res.status(500).json({ ...payload, enviado: false, erro: err.message });
  }
});

module.exports = router;
