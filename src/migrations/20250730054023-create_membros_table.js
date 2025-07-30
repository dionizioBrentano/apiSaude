'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('membros', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      funcao: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'MEMBRO',
      },
      is_responsavel_pagamento: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      pessoa_id: { // FK para a pessoa
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'pessoas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      organizacao_id: { // FK para a organização
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'organizacoes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
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
    await queryInterface.dropTable('membros');
  }
};