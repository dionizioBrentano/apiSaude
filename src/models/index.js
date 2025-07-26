// src/models/index.js (VERSÃO QUE VOCÊ ME MOSTROU E QUE CAUSOU O PROBLEMA - VOLTE PARA ELA)
// Importa as dependências necessárias
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
// Carrega a configuração do banco de dados do arquivo de configuração
const dbConfig = require('../config/database');
// Cria a conexão com o banco de dados usando as configurações
const connection = new Sequelize(dbConfig);
// Objeto que irá armazenar todos os models da aplicação
const models = {};
// Lê todos os arquivos da pasta atual (src/models)
fs.readdirSync(__dirname)
  // Filtra os arquivos para não incluir o próprio 'index.js' e arquivos que não são .js
  .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js'))
  // Para cada arquivo de model encontrado...
  .forEach(file => {
    // ...importa o model...
    const model = require(path.join(__dirname, file))(connection, Sequelize.DataTypes);
    // ...e o armazena no objeto 'models'.
    models[model.name] = model;
  });
// Após carregar todos os models, percorre cada um para criar as associações (relacionamentos)
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});
// Exporta a conexão e os models para serem utilizados em outras partes da aplicação
module.exports = {
  sequelize: connection,
  Sequelize,
  models,
};