// src/models/Transacao.model.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transacao extends Model {
    static associate(models) {
      this.belongsTo(models.Pessoa, { foreignKey: 'pagadorId', as: 'pagador' });
      this.belongsTo(models.Organizacao, { foreignKey: 'organizacaoId', as: 'organizacao' });
      this.belongsTo(models.EntidadeProtegida, { foreignKey: 'entidadeProtegidaId', as: 'entidadeProtegida' });
    }
  }
  Transacao.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Valor da transação.'
    },
    status: {
      type: DataTypes.ENUM('PENDENTE', 'APROVADA', 'RECUSADA', 'CANCELADA'),
      defaultValue: 'PENDENTE',
      allowNull: false,
      comment: 'Status da transação (ex: pendente, aprovada, recusada).'
    },
    metodoPagamento: {
      type: DataTypes.STRING, // Ex: 'PIX', 'CARTAO_CREDITO', 'BOLETO', 'CUPOM'
      allowNull: true,
      field: 'metodo_pagamento',
      comment: 'Método de pagamento utilizado.'
    },
    // ID da entidade que está sendo "ativada" por esta transação
    entidadeProtegidaId: {
      type: DataTypes.UUID,
      allowNull: true, // Pode ser nulo se a transação for para outra finalidade
      field: 'entidade_protegida_id'
    },
    // ID da Pessoa que iniciou o pagamento
    pagadorId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'pagador_id',
    },
    // ID da Organização que recebe o pagamento (se for o caso)
    organizacaoId: {
      type: DataTypes.UUID,
      allowNull: true, // Pode ser nulo se for um pagamento direto da pessoa sem organização beneficiária
      field: 'organizacao_id',
    }
  }, {
    sequelize,
    modelName: 'Transacao',
    tableName: 'transacoes',
    timestamps: true,
    paranoid: true, // Transações podem precisar de soft delete por auditoria
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });

  return Transacao;
};