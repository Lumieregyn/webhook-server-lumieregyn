const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rota principal (verificação de saúde)
app.get('/', (req, res) => {
  res.send('Servidor Webhook Lumieregyn está ativo!');
});

// Rota de webhook da SURI
app.post('/webhook', (req, res) => {
  const data = req.body;
  const log = `[${new Date().toISOString()}] Webhook recebido: ${JSON.stringify(data)}\n`;
  fs.appendFileSync('logs.txt', log);
  res.sendStatus(200);
});

// Rota para visualizar os logs
app.get('/logs', (req, res) => {
  if (fs.existsSync('logs.txt')) {
    const logs = fs.readFileSync('logs.txt', 'utf8');
    res.setHeader('Content-Type', 'text/plain');
    res.send(logs);
  } else {
    res.send('Nenhum log registrado ainda.');
  }
});

// NOVA ROTA: análise de conversa com IA (Versão 1.0)
app.post('/conversa', async (req, res) => {
  const { cliente, vendedor, mensagem } = req.body;

  const checklist = {
    produto: /produto|modelo|lumin[aá]ria/i.test(mensagem),
    cor: /cor|dourado|preto|branco|cobre/i.test(mensagem),
    medidas: /medida|cm|tamanho|dimens[aã]o/i.test(mensagem),
    quantidade: /quantidade|unidade|peca|peça/i.test(mensagem),
    tensao: /bivolt|110|220|voltagem|tens[aã]o/i.test(mensagem),
    prazo: /prazo|entrega|dias [uú]teis/i.test(mensagem),
    resumo: /resumo|confirmar|finalizar|confer[aê]ncia/i.test(mensagem)
  };

  const alertas = Object.entries(checklist)
    .filter(([_, confirmado]) => !confirmado)
    .map(([campo]) => `⚠️ Falta confirmar: ${campo}`);

  const resposta = {
    cliente,
    vendedor,
    checklist,
    status: alertas.length === 0 ? "completo" : "incompleto",
    alertas,
    sugestao: alertas.length > 0
      ? "Recomenda-se validar os pontos pendentes antes de seguir com o pedido."
      : "Todos os pontos foram confirmados, pronto para prosseguir."
  };

  res.json(resposta);
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor ativo na porta ${PORT}`);
});
