'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Enderecos', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      pessoaId: { // Endereço pertence a uma Pessoa
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Pessoas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tipoEndereco: { // Ex: Residencial, Comercial, Correspondência
        type: Sequelize.ENUM('Residencial', 'Comercial', 'Correspondência'),
        allowNull: false
      },
      logradouro: {
        type: Sequelize.STRING,
        allowNull: false
      },
      numero: {
        type: Sequelize.STRING,
        allowNull: true
      },
      complemento: {
        type: Sequelize.STRING,
        allowNull: true
      },
      bairro: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cidade: {
        type: Sequelize.STRING,
        allowNull: false
      },
      estado: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cep: {
        type: Sequelize.STRING,
        allowNull: false
      },
      pais: {
        type: Sequelize.STRING,
        defaultValue: 'Brasil',
        allowNull: false
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
    await queryInterface.dropTable('Enderecos');
  }
};