'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Membros', { // Nome da tabela
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      organizacaoId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Organizacaos', // Nome da tabela referenciada
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      pessoaId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Pessoas', // Nome da tabela referenciada
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      funcao: { // Ex: LIDER, MEMBRO_COMUM, ADMINISTRADOR_FINANCEIRO
        type: Sequelize.ENUM('LIDER', 'MEMBRO_COMUM', 'ADMINISTRADOR_FINANCEIRO'),
        defaultValue: 'MEMBRO_COMUM',
        allowNull: false
      },
      isResponsavelPagamento: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable('Membros');
  }
};