'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('organizacoes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      tipo: {
        type: Sequelize.ENUM('GRUPO', 'ORGANIZACAO'),
        allowNull: false,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nome_fantasia: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cnpj: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
      },
      situacao_cnpj: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      data_abertura: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      cnae_principal: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      natureza_juridica: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cep: { type: Sequelize.STRING, allowNull: true },
      logradouro: { type: Sequelize.STRING, allowNull: true },
      numero: { type: Sequelize.STRING, allowNull: true },
      complemento: { type: Sequelize.STRING, allowNull: true },
      bairro: { type: Sequelize.STRING, allowNull: true },
      cidade: { type: Sequelize.STRING, allowNull: true },
      estado: { type: Sequelize.STRING, allowNull: true },
      pais: { type: Sequelize.STRING, defaultValue: 'Brasil', allowNull: true },
      organizacao_pai_id: { // Para hierarquia
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'organizacoes', // Auto-referência
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      criador_id: { // FK para a pessoa criadora
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'pessoas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION' // Ou 'SET NULL' se desejar
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
    await queryInterface.dropTable('organizacoes');
  }
};