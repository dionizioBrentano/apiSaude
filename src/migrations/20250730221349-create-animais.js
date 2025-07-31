'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Animais', {
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
      apelido: {
        type: Sequelize.STRING,
        allowNull: true
      },
      especie: {
        type: Sequelize.STRING,
        allowNull: false
      },
      raca: {
        type: Sequelize.STRING,
        allowNull: true
      },
      sexo: {
        type: Sequelize.ENUM('Macho', 'Fêmea', 'Indefinido'),
        allowNull: false
      },
      dataNascimento: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      cor: {
        type: Sequelize.STRING,
        allowNull: true
      },
      descricao: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('Animais');
  }
};