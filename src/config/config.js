// api/src/config/config.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

console.log('--- DEBUG DE CREDENCIAIS DO BANCO DE DADOS EM config.js (Correção Final: Logging) ---');
console.log(`DB_USERNAME lido: ${process.env.DB_USERNAME} (tipo: ${typeof process.env.DB_USERNAME})`);
console.log(`DB_PASSWORD lido: ${process.env.DB_PASSWORD ? '****** (presente)' : '(AUSENTE)'} (tipo: ${typeof process.env.DB_PASSWORD})`);
console.log(`DB_DATABASE lido: ${process.env.DB_DATABASE} (tipo: ${typeof process.env.DB_DATABASE})`);
console.log(`DB_HOST lido: ${process.env.DB_HOST} (tipo: ${typeof process.env.DB_HOST})`);
console.log(`DB_PORT lido: ${process.env.DB_PORT} (tipo: ${typeof process.env.DB_PORT})`);
console.log('-----------------------------------------------------------------------------------');

if (!process.env.DB_USERNAME || !process.env.DB_PASSWORD || !process.env.DB_DATABASE || !process.env.DB_HOST || !process.env.DB_PORT) {
    console.error('ERRO CRÍTICO: Variáveis de ambiente do banco de dados (DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_HOST, DB_PORT) NÃO estão definidas no arquivo .env ou são vazias.');
    console.error('Por favor, certifique-se de que seu arquivo .env na raiz do projeto está configurado corretamente.');
    process.exit(1);
}

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: msg => console.log(msg),
    timezone: '-03:00',
    connectTimeout: 60000 // <--- ADICIONADO: Aumenta o tempo limite de conexão para 60 segundos
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_TEST_DATABASE || `${process.env.DB_DATABASE}_test`,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    connectTimeout: 60000 // <--- ADICIONADO
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_PRODUCTION_DATABASE || `${process.env.DB_DATABASE}_production`,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    connectTimeout: 60000 // <--- ADICIONADO
  }
};