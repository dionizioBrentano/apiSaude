'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('eventos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      entidade_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      tipo_evento: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dados_evento: {
        type: Sequelize.JSON,
        allowNull: false
      },
      executado_por_usuario_id: {
        type: Sequelize.UUID,
        allowNull: true, // Permitir nulo para eventos de sistema ou auto-cadastro
        references: {
          model: 'pessoas',
          key: 'id'
        },
        onDelete: 'SET NULL' // Alterado para SET NULL para não perder o evento se a pessoa for deletada
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('eventos');
  }
};
