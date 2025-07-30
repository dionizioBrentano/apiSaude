'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('documentos', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      tipo_documento: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      numero: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      orgao_emissor: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      data_emissao: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      uf_emissao: {
        type: Sequelize.STRING(2),
        allowNull: true,
      },
      url_digitalizacao: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable('documentos');
  }
};