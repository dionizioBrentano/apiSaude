const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// CONFIANÇA NA LOCALIZAÇÃO: server.js está em api/src/
// Portanto, para rotas em api/src/routes/, o caminho é './routes/'
// E para 'public' em api/public/, o caminho é '../public/'

// Importar suas rotas (usando caminho absoluto para máxima certeza)
const routesPath = path.join(__dirname, 'routes'); // Caminho para a pasta 'routes'
const pessoaRoutes = require(path.join(routesPath, 'pessoaRoutes')); // Importa pessoaRoutes.js
const authRoutes = require(path.join(routesPath, 'authRoutes'));     // Importa authRoutes.js
// const animalRoutes = require(path.join(routesPath, 'animalRoutes')); // Descomente e ajuste se usar

const app = express();
const PORT = process.env.PORT || 3333;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve os arquivos estáticos da pasta 'public'
// 'public' está um nível acima de 'src', então '..' do __dirname (que é api/src/)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rotas da API
app.use('/api/v1/pessoas', pessoaRoutes);
app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/animais', animalRoutes); // Descomente e ajuste se tiver esta rota para teste de permissão

// Captura rotas não encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({ message: 'Rota não encontrada' });
});

// Manipulador de erros global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erro interno do servidor', error: err.message });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
    console.log(`Ratificando: Acesse a bancada de testes em http://localhost:${PORT}/index.html`);