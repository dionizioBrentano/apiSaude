'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Transacaos', { // Tabela para gerenciar pagamentos/ativacoes
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      organizacaoId: { // Organização que gerou a transação (compra de QR Code, etc)
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Organizacaos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      entidadeProtegidaId: { // Se a transação está vinculada a uma Entidade Protegida específica
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'EntidadeProtegidas', // Assumindo esta é a tabela do modelo
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      tipoTransacao: { // Ex: COMPRA_QR_CODE, ATIVACAO_SERVICO, PAGAMENTO_MENSALIDADE
        type: Sequelize.STRING,
        allowNull: false
      },
      valor: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      status: { // Ex: PENDENTE, CONCLUIDA, CANCELADA, ESTORNADA
        type: Sequelize.ENUM('PENDENTE', 'CONCLUIDA', 'CANCELADA', 'ESTORNADA'),
        defaultValue: 'PENDENTE',
        allowNull: false
      },
      metodoPagamento: { // Ex: PIX, CARTAO, CUPOM
        type: Sequelize.STRING,
        allowNull: true
      },
      codigoCupom: {
        type: Sequelize.STRING,
        allowNull: true
      },
      dataTransacao: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
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
    await queryInterface.dropTable('Transacaos');
  }
};