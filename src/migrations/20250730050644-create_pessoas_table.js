'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pessoas', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      nome_completo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      senha: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      telefone_celular: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      data_nascimento: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      status_conta: {
        type: Sequelize.STRING,
        defaultValue: 'PENDENTE_VERIFICACAO',
      },
      cpf_hash: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true, // Será preenchido em uma etapa posterior
      },
      ultimo_login: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      token_validacao_conta: { // Nova coluna para validação
        type: Sequelize.UUID, // Usamos UUID aqui para o token
        allowNull: true, // Será nulo após a validação
        unique: true, // Garante que cada token seja único
      },
      data_expiracao_token: { // Nova coluna para expiração do token
        type: Sequelize.DATE,
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
      deleted_at: { // Para soft delete
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pessoas');
  }
};
