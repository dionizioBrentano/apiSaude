// src/models/Membro.model.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Membro extends Model {
    static associate(models) {
      this.belongsTo(models.Pessoa, { foreignKey: 'pessoaId', as: 'pessoa' });
      this.belongsTo(models.Organizacao, { foreignKey: 'organizacaoId', as: 'organizacao' });
    }
  }
  Membro.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    funcao: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'MEMBRO',
      comment: 'Função do membro dentro da organização (ex: LIDER, MEMBRO, FINANCEIRO, ENFERMEIRO).'
    },
    isResponsavelPagamento: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_responsavel_pagamento',
      comment: 'Indica se este membro é o responsável pelos pagamentos da organização/grupo.'
    },
    pessoaId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'pessoa_id',
    },
    organizacaoId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'organizacao_id',
    }
  }, {
    sequelize,
    modelName: 'Membro',
    tableName: 'membros',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });

  return Membro;
};