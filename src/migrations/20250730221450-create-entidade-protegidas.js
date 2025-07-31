'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EntidadeProtegidas', { // Tabela para as URLs públicas
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      organizacaoId: { // A Entidade Protegida pertence a uma Organização
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Organizacaos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      // Vinculo polimórfico (ID da Pessoa, Animal ou Objeto)
      entidadeOriginalId: { 
        type: Sequelize.UUID,
        allowNull: false
      },
      entidadeOriginalTipo: { // 'Pessoa', 'Animal', 'Objeto'
        type: Sequelize.ENUM('Pessoa', 'Animal', 'Objeto'),
        allowNull: false
      },
      urlPublicaHash: { // O hash único para a URL pública e QR Code
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      status: { // AGUARDANDO_PAGAMENTO, ATIVO, PAUSADO, INATIVO
        type: Sequelize.ENUM('AGUARDANDO_PAGAMENTO', 'ATIVO', 'PAUSADO', 'INATIVO'),
        defaultValue: 'AGUARDANDO_PAGAMENTO',
        allowNull: false
      },
      dataAtivacao: {
        type: Sequelize.DATE,
        allowNull: true // Data em que o status muda para ATIVO (pago/ativado)
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
    await queryInterface.dropTable('EntidadeProtegidas');
  }
};