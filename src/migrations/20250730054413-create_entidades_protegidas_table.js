'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('entidades_protegidas', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      url_publica_hash: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      tipo_entidade: {
        type: Sequelize.ENUM('PESSOA', 'ANIMAL', 'OBJETO'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('PENDENTE_ATIVACAO', 'ATIVO', 'INATIVO'),
        defaultValue: 'PENDENTE_ATIVACAO',
        allowNull: false,
      },
      is_pago: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      cupom_utilizado: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      data_ativacao: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      configuracao_exibicao: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      entidade_id: { // ID da Pessoa, Animal ou Objeto real
        type: Sequelize.UUID,
        allowNull: false,
      },
      organizacao_id: { // FK para a Organização/Grupo proprietária
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'organizacoes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION' // Ou SET NULL, dependendo da regra de negócio
      },
      comprador_qrcode_id: { // FK para a Pessoa que fez a compra/ativação
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'pessoas',
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
    await queryInterface.dropTable('entidades_protegidas');
  }
};