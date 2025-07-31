'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('organizacoes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tipo: {
        type: Sequelize.ENUM('GRUPO', 'EMPRESA', 'FAMILIA', 'ONG'),
        defaultValue: 'GRUPO',
        allowNull: false
      },
      organizacaoPaiId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'organizacoes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      criadorId: { // <--- FIX: Adicionando o campo criadorId na migração
        type: Sequelize.UUID,
        allowNull: false, // <--- FIX: Definindo como NOT NULL
        references: {
          model: 'pessoas', // Referencia a tabela 'pessoas'
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION' // Ou 'SET NULL' dependendo da sua regra de negócio
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
    await queryInterface.dropTable('organizacoes');
  }
};