// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Objeto de configuração para o Sequelize
module.exports = {
  // Dialeto do banco de dados que estamos utilizando
  dialect: process.env.DB_DIALECT || 'mysql',
  
  // Host onde o banco de dados está rodando
  host: process.env.DB_HOST,
  
  // Usuário de acesso ao banco de dados
  username: process.env.DB_USER,
  
  // Senha de acesso ao banco de dados
  password: process.env.DB_PASS,
  
  // Nome do banco de dados que será utilizado
  database: process.env.DB_NAME,
  
  // Configurações dos models
  define: {
    // Usa o padrão snake_case para nomes de tabelas e colunas (ex: created_at)
    // Isso é uma convenção comum e facilita a leitura no banco.
    underscored: true,
    underscoredAll: true,
    // Define os nomes dos campos de timestamp
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  
  // Configurações do dialeto (específicas para MySQL)
  dialectOptions: {
    // Garante que o fuso horário utilizado seja o do seu servidor local
    timezone: 'local',
  },
  
  // Define o fuso horário da aplicação
  timezone: 'America/Sao_Paulo',
};