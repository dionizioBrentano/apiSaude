'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('auditoria_logs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      usuario_id: { // FK para a Pessoa que realizou a ação
        type: Sequelize.UUID,
        allowNull: true, // Pode ser nulo para ações do sistema
        references: {
          model: 'pessoas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      tipo_acao: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      entidade_afetada_tipo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      entidade_afetada_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      dados_anteriores: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      dados_novos: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      ip_address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('auditoria_logs');
  }
};