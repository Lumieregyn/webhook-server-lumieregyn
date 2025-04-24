const express = require("express");
const router = express.Router();

router.post("/conversa", (req, res) => {
    const { cliente, vendedor, checklist } = req.body;

    if (!cliente || !vendedor || !checklist) {
        return res.status(400).json({ status: "erro", erro: "Dados incompletos na requisição." });
    }

    const pendentes = [];
    for (const campo in checklist) {
        if (!checklist[campo]) pendentes.push(campo);
    }

    const alertas = pendentes.map(campo => `⚠️ Falta confirmar: ${campo}`);
    const status = pendentes.length > 0 ? "incompleto" : "ok";

    return res.json({
        status,
        cliente,
        vendedor,
        checklist,
        alertas,
        sugestao: status === "incompleto" ? "Recomenda-se validar os pontos pendentes antes de seguir com o pedido." : "Checklist completo."
    });
});

module.exports = router;
