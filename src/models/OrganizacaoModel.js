'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Organizacao extends Model {
    static associate(models) {
      Organizacao.hasMany(models.Membro, { foreignKey: 'organizacaoId', as: 'membros' });
      Organizacao.hasMany(models.Animal, { foreignKey: 'organizacaoId', as: 'animais' });
      Organizacao.hasMany(models.Objeto, { foreignKey: 'organizacaoId', as: 'objetos' });
      Organizacao.hasMany(models.Transacao, { foreignKey: 'organizacaoId', as: 'transacoes' });
      Organizacao.hasMany(models.EntidadeProtegida, { foreignKey: 'organizacaoId', as: 'entidadesProtegidas' });
      // Para hierarquia de organizações
      Organizacao.belongsTo(models.Organizacao, { foreignKey: 'organizacaoPaiId', as: 'organizacaoPai' });
      Organizacao.hasMany(models.Organizacao, { foreignKey: 'organizacaoPaiId', as: 'subOrganizacoes' });
      // Fix: Add association to Pessoa for criadorId
      Organizacao.belongsTo(models.Pessoa, { foreignKey: 'criadorId', as: 'criador' });
    }
  }
  Organizacao.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM('GRUPO', 'EMPRESA', 'FAMILIA', 'ONG'),
      defaultValue: 'GRUPO',
      allowNull: false
    },
    organizacaoPaiId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    criadorId: { // <--- FIX: Adicionando o campo criadorId
        type: DataTypes.UUID,
        allowNull: false // <--- FIX: Definindo como NOT NULL, conforme o erro
    }
  }, {
    sequelize,
    modelName: 'Organizacao',
    tableName: 'organizacoes',
    paranoid: true
  });
  return Organizacao;
};