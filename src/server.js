// 1. Carrega as variáveis de ambiente
require('dotenv').config();

// 2. Importa as dependências
const express = require('express');
const db = require('./models');

// 3. Importa os middlewares
const ErrorHandlerMiddleware = require('./middleware/ErrorHandlerMiddleware'); // <-- NOME ATUALIZADO

// 4. Importa os arquivos de rota com seus nomes padronizados
const pessoaRoutes = require('./routes/pessoaRoutes.js'); // <-- NOME ATUALIZADO
const authRoutes = require('./routes/authRoutes.js');
const animalRoutes = require('./routes/animalRoutes.js'); // <-- NOME ATUALIZADO

// 5. Inicializa a aplicação Express
const app = express();

// 6. Configura middlewares da aplicação
app.use(express.json());

// 7. Define as rotas principais da API
app.use('/api/v1/pessoas', pessoaRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/animais', animalRoutes);

// 8. Registra o middleware de erro (DEPOIS DE TODAS AS ROTAS)
app.use(ErrorHandlerMiddleware); // <-- NOME ATUALIZADO

// 9. Define a porta do servidor
const PORT = process.env.PORT || 3333;

// 10. Inicia o servidor após conectar ao banco de dados
db.sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Não foi possível conectar ao banco de dados:', err);
    process.exit(1); 
  });