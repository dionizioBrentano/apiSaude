'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Objetos', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      organizacaoId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Organizacaos', // Referencia a tabela Organizacaos
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tipo: { // Ex: Celular, Chaveiro, Documento, Brinquedo
        type: Sequelize.STRING,
        allowNull: false
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      numeroSerial: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      cor: {
        type: Sequelize.STRING,
        allowNull: true
      },
      dataPerda: {
        type: Sequelize.DATEONLY,
        allowNull: true
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
    await queryInterface.dropTable('Objetos');
  }
};