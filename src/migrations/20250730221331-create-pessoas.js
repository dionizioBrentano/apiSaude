'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pessoas', { // <--- CORRIGIDO: Nome da tabela em minúsculas
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      nomeCompleto: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      senha: { // Armazenará o hash da senha
        type: Sequelize.STRING,
        allowNull: false
      },
      telefoneCelular: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dataNascimento: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      cpf_hash: { // Armazenará o hash do CPF
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      statusConta: { // Ex: PENDENTE, ATIVO_BASICO, ATIVO_COMPLETO, BLOQUEADO
        type: Sequelize.ENUM('PENDENTE', 'ATIVO_BASICO', 'ATIVO_COMPLETO', 'BLOQUEADO'),
        defaultValue: 'PENDENTE',
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
      deletedAt: { // Para soft delete (paranoid: true)
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pessoas');
  }
};