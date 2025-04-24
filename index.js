
const express = require('express');
const cors = require('cors');
const app = express();
const analiseRoute = require('./routes/analise');

app.use(cors());
app.use(express.json());
app.use('/', analiseRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
