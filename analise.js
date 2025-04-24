
const express = require('express');
const router = express.Router();

router.post('/conversa', (req, res) => {
    const dados = req.body;
    const pendencias = [];
    if (!dados.prazo) pendencias.push("prazo");
    if (!dados.resumo) pendencias.push("resumo");

    if (pendencias.length > 0) {
        return res.json({
            status: "erro",
            enviado: false,
            alertas: pendencias.map(p => `⚠️ Falta confirmar: ${p}`)
        });
    }

    res.json({ status: "ok", enviado: true });
});

module.exports = router;
