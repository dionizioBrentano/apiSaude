// 1. CONFIGURAÇÃO INICIAL
// Carrega as variáveis de ambiente do arquivo .env o mais cedo possível
require('dotenv').config();

// 2. IMPORTAÇÕES PRINCIPAIS
const express = require('express');
const db = require('./models'); // O 'index.js' dos models, que inicializa o Sequelize

// 3. IMPORTAÇÃO DOS MÓDULOS DE ROTAS
// Rota dedicada para autenticação (login, logout, etc.)
const authRoutes = require('./routes/authRoutes.js');
// Nosso novo Roteador Universal para todas as operações de CRUD
const crudRoutes = require('./routes/crudRoutes.js');

// 4. IMPORTAÇÃO DOS MIDDLEWARES
const ErrorHandlerMiddleware = require('./middleware/ErrorHandlerMiddleware');

// 5. INICIALIZAÇÃO DA APLICAÇÃO EXPRESS
const app = express();

// 6. MIDDLEWARES GLOBAIS DA APLICAÇÃO
// Permite que a aplicação entenda requisições com corpo no formato JSON
app.use(express.json());

// 7. REGISTRO DAS ROTAS
// Todas as rotas de autenticação estarão sob o prefixo /api/v1/auth
app.use('/api/v1/auth', authRoutes);
// O roteador universal cuidará de todas as outras entidades sob /api/v1
// Ex: /api/v1/pessoas, /api/v1/animais, etc.
app.use('/api/v1', crudRoutes);

// 8. REGISTRO DO MIDDLEWARE DE TRATAMENTO DE ERROS
// IMPORTANTE: Deve ser o último 'app.use()' a ser registrado
app.use(ErrorHandlerMiddleware);

// 9. DEFINIÇÃO DA PORTA E INICIALIZAÇÃO DO SERVIDOR
const PORT = process.env.PORT || 3333;

let server;
// Verifica a conexão com o banco de dados ANTES de iniciar o servidor web
db.sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
    // Inicia o servidor e guarda a referência para o graceful shutdown
    server = app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Não foi possível conectar ao banco de dados:', err);
    process.exit(1); // Encerra a aplicação se não conseguir conectar ao DB
  });

// 10. LÓGICA DE "GRACEFUL SHUTDOWN"
// Garante que as conexões sejam fechadas corretamente quando o servidor é desligado
const gracefulShutdown = () => {
  console.log('🔌 Recebido sinal para desligar. Fechando conexões...');
  server.close(() => {
    console.log('✅ Servidor HTTP fechado.');
    db.sequelize.close().then(() => {
      console.log('✅ Conexão com o banco de dados fechada.');
      process.exit(0);
    });
  });
};

// Ouve por sinais de término do processo (ex: Ctrl+C no terminal)
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);