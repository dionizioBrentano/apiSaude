// 1. Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// 2. Importa as dependências necessárias
const express = require('express');
const db = require('./models');
const errorHandlerMiddleware = require('./middleware/ErrorHandlerMiddleware');

// 3. Importa os arquivos de rota
const pessoaRoutes = require('./routes/pessoaRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const animalRoutes = require('./routes/animalRoutes.js');

// 4. Inicializa a aplicação Express
const app = express();

// 5. Configura o middleware para entender JSON
app.use(express.json());

// 6. Define as rotas principais da API
app.use('/api/v1/pessoas', pessoaRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/animais', animalRoutes);

// 7. REGISTRA O MIDDLEWARE DE ERRO
app.use(errorHandlerMiddleware);

// 8. Define a porta do servidor
const PORT = process.env.PORT || 3333;

// 9. Inicia o servidor E GUARDA A REFERÊNCIA DELE
let server;
db.sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
    server = app.listen(PORT, () => { // <--- Guarda a referência aqui
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Não foi possível conectar ao banco de dados:', err);
    process.exit(1);
  });

// ↓↓↓ ADICIONE ESTE BLOCO NO FINAL DO ARQUIVO ↓↓↓
// 10. Lógica de Graceful Shutdown
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

// Ouve por sinais de término comuns
process.on('SIGTERM', gracefulShutdown); // Sinal de término padrão
process.on('SIGINT', gracefulShutdown);  // Sinal de interrupção (Ctrl+C)