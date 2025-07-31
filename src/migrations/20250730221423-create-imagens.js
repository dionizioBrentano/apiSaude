'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Imagens', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      ownerId: { // ID da entidade a que a imagem pertence (Pessoa, Animal, Objeto)
        type: Sequelize.UUID,
        allowNull: false
      },
      ownerType: { // Tipo da entidade (Pessoa, Animal, Objeto)
        type: Sequelize.ENUM('Pessoa', 'Animal', 'Objeto'),
        allowNull: false
      },
      url: { // URL da imagem armazenada
        type: Sequelize.STRING,
        allowNull: false
      },
      descricao: {
        type: Sequelize.STRING,
        allowNull: true
      },
      isPrincipal: { // Se é a imagem principal da entidade
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Imagens');
  }
};