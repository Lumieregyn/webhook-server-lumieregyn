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
