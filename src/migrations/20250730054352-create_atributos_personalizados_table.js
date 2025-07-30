'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('atributos_personalizados', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      chave: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      valor: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      tipo_dado: {
        type: Sequelize.ENUM('TEXTO', 'NUMERO', 'BOOLEANO', 'DATA', 'JSON'),
        defaultValue: 'TEXTO',
        allowNull: false,
      },
      owner_id: { // Chave para a entidade polimórfica
        type: Sequelize.UUID,
        allowNull: false,
      },
      owner_type: { // Tipo da entidade polimórfica
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('atributos_personalizados');
  }
};