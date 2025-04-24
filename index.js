const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/conversa', (req, res) => {
  const { cliente, vendedor, checklist } = req.body;

  // Validação básica
  if (!cliente || !vendedor || typeof checklist !== 'object') {
    return res.status(400).json({
      status: 'erro',
      erro: 'Dados ausentes ou inválidos. Certifique-se de enviar cliente, vendedor e checklist corretamente.'
    });
  }

  const camposObrigatorios = [
    'produto',
    'cor',
    'medidas',
    'quantidade',
    'tensao',
    'prazo',
    'resumo'
  ];

  const alertas = [];
  const confirmacoes = {};

  camposObrigatorios.forEach(campo => {
    const confirmado = checklist[campo] === true;
    confirmacoes[campo] = confirmado;

    if (!confirmado) {
      alertas.push(`⚠️ Falta confirmar: ${campo}`);
    }
  });

  const statusAtendimento = alertas.length > 0 ? 'incompleto' : 'completo';

  const resposta = {
    cliente,
    vendedor,
    checklist: confirmacoes,
    status: statusAtendimento,
    alertas,
    sugestao: alertas.length > 0
      ? 'Recomenda-se validar os pontos pendentes antes de seguir com o pedido.'
      : 'Atendimento completo. Pronto para formalizar o pedido.'
  };

  // Aqui entraria o envio para SURI futuramente (alerta automático via WhatsApp)

  return res.status(200).json(resposta);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
