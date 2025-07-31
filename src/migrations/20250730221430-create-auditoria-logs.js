'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AuditoriaLogs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      usuarioId: { // Quem realizou a ação (PessoaId)
        type: Sequelize.UUID,
        allowNull: true, // Pode ser null para ações do sistema ou não autenticadas
        references: {
          model: 'Pessoas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      tipoAcao: { // Ex: CREATE, UPDATE, DELETE, LOGIN, LOGOUT, VALIDACAO_CONTA
        type: Sequelize.STRING,
        allowNull: false
      },
      entidadeAfetadaTipo: { // Ex: Pessoa, Organizacao, Animal, Objeto
        type: Sequelize.STRING,
        allowNull: false
      },
      entidadeAfetadaId: { // ID da entidade que sofreu a ação
        type: Sequelize.UUID,
        allowNull: false
      },
      dadosAnteriores: { // JSON dos dados antes da alteração (para UPDATE/DELETE)
        type: Sequelize.JSON,
        allowNull: true
      },
      dadosNovos: { // JSON dos dados após a alteração (para CREATE/UPDATE)
        type: Sequelize.JSON,
        allowNull: true
      },
      ipAddress: { // Endereço IP do requisitante
        type: Sequelize.STRING,
        allowNull: true
      },
      userAgent: { // User-Agent do requisitante
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: { // Timestamp da ação
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('AuditoriaLogs');
  }
};