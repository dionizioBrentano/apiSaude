// src/config/config.js
// Carrega as variáveis de ambiente do arquivo .env, que está na raiz do projeto
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

// Este arquivo exporta as configurações do banco de dados para diferentes ambientes
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: console.log // Ativar logs SQL para depuração em desenvolvimento
  },
  test: {
    username: process.env.DB_USER_TEST || process.env.DB_USER,
    password: process.env.DB_PASS_TEST || process.env.DB_PASS,
    database: process.env.DB_NAME_TEST || process.env.DB_NAME,
    host: process.env.DB_HOST_TEST || process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    port: process.env.DB_PORT_TEST || process.env.DB_PORT || 3306,
    logging: false
  },
  production: {
    username: process.env.DB_USER_PROD,
    password: process.env.DB_PASS_PROD,
    database: process.env.DB_NAME_PROD,
    host: process.env.DB_HOST_PROD,
    dialect: process.env.DB_DIALECT || 'mysql',
    port: process.env.DB_PORT_PROD || 3306,
    logging: false
  }
};