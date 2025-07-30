'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('enderecos', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      tipo_endereco: {
        type: Sequelize.ENUM('RESIDENCIAL', 'COMERCIAL', 'ENTREGA', 'COBRANCA', 'OUTRO'),
        allowNull: false,
        defaultValue: 'RESIDENCIAL',
      },
      cep: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      logradouro: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      numero: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      complemento: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bairro: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cidade: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      estado: {
        type: Sequelize.STRING(2),
        allowNull: false,
      },
      pais: {
        type: Sequelize.STRING,
        defaultValue: 'Brasil',
        allowNull: false,
      },
      is_principal: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      pessoa_id: { // FK para pessoa (pode ser nulo se for de organização)
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'pessoas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      organizacao_id: { // FK para organização (pode ser nulo se for de pessoa)
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
    await queryInterface.dropTable('enderecos');
  }
};