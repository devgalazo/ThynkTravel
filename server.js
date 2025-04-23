require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connection = require('./db/connection');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3306;

// CORS configurado
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:3000', 'http://localhost:5500'],
    methods: ['GET', 'POST'],
    credentials: true
}));

//Middlewares para ler JSON
app.use(express.json());

app.use(express.static('public'));

// Rotas de autenticação
app.use('/api', authRoutes);

// Rota de teste
app.get('/', (req, res) => {
    res.send('API funcionando! 🚀');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
