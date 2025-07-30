'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transacoes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      valor: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('PENDENTE', 'APROVADA', 'RECUSADA', 'CANCELADA'),
        defaultValue: 'PENDENTE',
        allowNull: false,
      },
      metodo_pagamento: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      entidade_protegida_id: { // FK para a Entidade Protegida ativada pela transação
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'entidades_protegidas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      pagador_id: { // FK para a Pessoa que iniciou o pagamento
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'pessoas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      organizacao_id: { // FK para a Organização/Grupo que recebe o pagamento
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'organizacoes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    await queryInterface.dropTable('transacoes');
  }
};