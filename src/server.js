const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

console.log('--- server.js EXECUTADO (versão final com rota de Organizacoes) ---');

const app = express();
const PORT = process.env.PORT || 3333;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rotas da API
const routesDir = path.join(__dirname, 'routes');
const pessoaRoutes = require(path.join(routesDir, 'pessoaRoutes'));
const authRoutes = require(path.join(routesDir, 'authRoutes'));
const organizacaoRoutes = require(path.join(routesDir, 'organizacaoRoutes')); // NOVO: Importa rota de Organizacoes

app.use('/api/v1/pessoas', pessoaRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/organizacoes', organizacaoRoutes); // NOVO: Usa rota de Organizacoes
// Remova ou comente esta linha se não tiver rota de animais ainda:
// const animalRoutes = require(path.join(routesDir, 'animalRoutes'));
// app.use('/api/v1/animais', animalRoutes);

// Captura rotas não encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({ message: 'Rota não encontrada' });
});

// Manipulador de erros global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erro interno do servidor', error: err.message });
});

const db = require('./models'); 

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse a bancada de testes em http://localhost:${PORT}/index.html`);
});