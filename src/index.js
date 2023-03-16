const express = require('express');
const rotas = require('./rotas');
const cors = require('cors');
require('dotenv')

const app = express();

app.use(express.json());
app.use(cors());
app.use(rotas);

app.listen(process.env.PORT, () => {
    console.log('Servidor Conectado a Porta 8000')
});
