const { models } = require('../models');

// Este mapa traduz o nome da rota para o Model do Sequelize correspondente.
const entityMap = {
  pessoas: models.Pessoa,
  animais: models.Animal,
  // Quando criarmos 'objetos', o registraremos aqui.
};

// Função que o nosso controller universal usa para pegar o model correto.
const getModel = (entityName) => {
  const model = entityMap[entityName];
  if (!model) {
    throw new Error(`Entidade '${entityName}' não reconhecida.`);
  }
  return model;
};

module.exports = { getModel };