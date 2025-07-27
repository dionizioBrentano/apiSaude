'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pessoas', {
      id: { allowNull: false, primaryKey: true, type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
      nome_completo: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      senha: { type: Sequelize.STRING, allowNull: false },
      telefone_celular: { type: Sequelize.STRING, allowNull: false, unique: true },
      data_nascimento: { type: Sequelize.DATEONLY, allowNull: false },
      status_conta: { type: Sequelize.STRING, defaultValue: 'PENDENTE_VERIFICACAO' },
      cpf: { type: Sequelize.STRING, unique: true, allowNull: true }, // <-- Corrigido para permitir nulo
      // ... (demais colunas opcionais que já tínhamos)
      ultimo_login: { type: Sequelize.DATE, allowNull: true },
      nome_social: { type: Sequelize.STRING, allowNull: true },
      apelido: { type: Sequelize.STRING, allowNull: true },
      // ... etc, todos os outros campos que definimos.
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE },
      deleted_at: { type: Sequelize.DATE, allowNull: true }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pessoas');
  }
};
