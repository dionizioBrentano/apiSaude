'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('objetos', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      tipo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      marca: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      modelo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      numero_serie: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      estado_geral: {
        type: Sequelize.ENUM('NOVO', 'SEMINOVO', 'USADO_BOM_ESTADO', 'DANIFICADO'),
        allowNull: true,
      },
      valor_estimado: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      numero_nota_fiscal: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      url_nota_fiscal: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tutor_id: { // FK para a Pessoa tutora
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'pessoas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      organizacao_id: { // FK para a Organização/Grupo proprietária
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
    await queryInterface.dropTable('objetos');
  }
};