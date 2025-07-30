'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('imagens', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      is_principal: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      owner_id: { // Chave para a entidade polimórfica (Pessoa, Animal, Objeto, Organizacao)
        type: Sequelize.UUID,
        allowNull: false,
        // Não há REFERENCES aqui pois é polimórfico, a associação é feita no código
      },
      owner_type: { // Tipo da entidade polimórfica
        type: Sequelize.STRING, // Ex: 'PESSOA', 'ANIMAL', 'OBJETO', 'ORGANIZACAO'
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
    await queryInterface.dropTable('imagens');
  }
};