// src/models/Organizacao.model.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Organizacao extends Model {
    static associate(models) {
      // Uma Organização tem muitos Membros
      this.hasMany(models.Membro, { foreignKey: 'organizacaoId', as: 'membros' });

      // Uma Organização é criada por uma Pessoa
      this.belongsTo(models.Pessoa, { foreignKey: 'criadorId', as: 'criador' });

      // Relações de Hierarquia: Uma Organização pode ter uma pai e muitos filhos
      this.belongsTo(models.Organizacao, { as: 'organizacaoPai', foreignKey: 'organizacaoPaiId' });
      this.hasMany(models.Organizacao, { as: 'suborganizacoes', foreignKey: 'organizacaoPaiId' });

      // Associações com entidades que pertencem a esta Organização
      this.hasMany(models.Animal, { foreignKey: 'organizacaoId', as: 'animais' });
      this.hasMany(models.Objeto, { foreignKey: 'organizacaoId', as: 'objetos' });

      // Associação polimórfica para Imagens da Organização
      this.hasMany(models.Imagem, {
        foreignKey: 'ownerId',
        constraints: false,
        scope: { ownerType: 'ORGANIZACAO' },
        as: 'imagens'
      });

      // Associação polimórfica para Atributos Personalizados da Organização
      this.hasMany(models.AtributoPersonalizado, {
        foreignKey: 'ownerId',
        constraints: false,
        scope: { ownerType: 'ORGANIZACAO' },
        as: 'atributosPersonalizados'
      });
    }
  }
  Organizacao.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM('GRUPO', 'ORGANIZACAO'),
      allowNull: false,
      comment: 'Define se é um grupo informal ou uma organização formal com CNPJ.'
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Nome do grupo ou Razão Social da organização.'
    },
    nomeFantasia: {
      type: DataTypes.STRING,
      comment: 'Nome fantasia da organização.'
    },
    cnpj: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true, // CNPJ é opcional para 'GRUPO'
      comment: 'CNPJ da organização. Obrigatório se o tipo for ORGANIZACAO.'
    },
    situacaoCNPJ: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Situação do CNPJ na Receita Federal (ex: ATIVA).'
    },
    dataAbertura: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Data de fundação da empresa.'
    },
    cnaePrincipal: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Código da atividade econômica principal.'
    },
    naturezaJuridica: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cep: { type: DataTypes.STRING, allowNull: true },
    logradouro: { type: DataTypes.STRING, allowNull: true },
    numero: { type: DataTypes.STRING, allowNull: true },
    complemento: { type: DataTypes.STRING, allowNull: true },
    bairro: { type: DataTypes.STRING, allowNull: true },
    cidade: { type: DataTypes.STRING, allowNull: true },
    estado: { type: DataTypes.STRING, allowNull: true },
    pais: { type: DataTypes.STRING, defaultValue: 'Brasil', allowNull: true },
    organizacaoPaiId: { // Campo para a hierarquia
      type: DataTypes.UUID,
      allowNull: true, // Pode ser nulo se for a organização raiz
      field: 'organizacao_pai_id',
      comment: 'ID da organização/grupo pai, para hierarquias.'
    },
    criadorId: { // Chave estrangeira para a Pessoa que criou/lidera
      type: DataTypes.UUID,
      allowNull: false,
      field: 'criador_id'
    }
  }, {
    sequelize,
    modelName: 'Organizacao',
    tableName: 'organizacoes',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });

  return Organizacao;
};