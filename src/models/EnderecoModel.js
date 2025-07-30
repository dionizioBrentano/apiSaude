// src/models/Endereco.model.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Endereco extends Model {
    static associate(models) {
      this.belongsTo(models.Pessoa, { foreignKey: 'pessoaId', as: 'pessoa' });
      this.belongsTo(models.Organizacao, { foreignKey: 'organizacaoId', as: 'organizacao' });
    }
  }
  Endereco.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    tipoEndereco: {
      type: DataTypes.ENUM('RESIDENCIAL', 'COMERCIAL', 'ENTREGA', 'COBRANCA', 'OUTRO'),
      allowNull: false,
      field: 'tipo_endereco',
      defaultValue: 'RESIDENCIAL',
      comment: 'Classificação do endereço (ex: residencial, comercial).'
    },
    cep: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    logradouro: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numero: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    complemento: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bairro: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cidade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    pais: {
      type: DataTypes.STRING,
      defaultValue: 'Brasil',
      allowNull: false,
    },
    isPrincipal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_principal',
      comment: 'Indica se este é o endereço principal.'
    },
    pessoaId: {
      type: DataTypes.UUID,
      allowNull: true, // Pode ser nulo se o endereço for de uma Organização
      field: 'pessoa_id',
    },
    organizacaoId: {
      type: DataTypes.UUID,
      allowNull: true, // Pode ser nulo se o endereço for de uma Pessoa
      field: 'organizacao_id',
    }
  }, {
    sequelize,
    modelName: 'Endereco',
    tableName: 'enderecos',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });

  return Endereco;
};