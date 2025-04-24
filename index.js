const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const SURI_URL = 'https://app.suri.io/api/v1/message/send-text';
const TOKEN_SURI = 'c3b5eca4-707f-46df-852c-7ad6790d61f9';
const REMETENTE_ID = 'your-sender-id'; // Substituir pelo ID do remetente na SURI

app.post('/enviar-alerta', async (req, res) => {
    const { cliente, vendedor, checklist, alertas } = req.body;

    if (!cliente || !vendedor || !checklist || !alertas) {
        return res.status(400).json({ status: "erro", erro: "Campos obrigatórios ausentes." });
    }

    const pendencias = Object.entries(checklist)
        .filter(([_, confirmado]) => confirmado === false)
        .map(([campo, _]) => `- ${campo}`);

    const alerta = `🚨 *Alerta de Atendimento Incompleto* 🚨

*Vendedor:* ${vendedor}
*Cliente:* ${cliente}

Itens pendentes:
${pendencias.join("\n")}

Recomenda-se validar antes de finalizar o pedido.`;

    try {
        await axios.post(SURI_URL, {
            token: TOKEN_SURI,
            to: "554731703288", // WhatsApp de teste
            body: alerta,
            sender: REMETENTE_ID
        });

        res.json({ status: "ok", alerta });
    } catch (error) {
        res.status(500).json({ status: "erro", erro: error.message });
    }
});

app.get("/", (req, res) => {
    res.send("Servidor do Agente Supervisor ativo 🚀");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
