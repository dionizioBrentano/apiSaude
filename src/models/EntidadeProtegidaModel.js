// src/models/AtributoPersonalizado.model.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AtributoPersonalizado extends Model {
    static associate(models) {
      // Relação polimórfica (pertence a uma Pessoa, Animal, Objeto ou Organização)
      this.belongsTo(models.Pessoa, { foreignKey: 'ownerId', constraints: false, as: 'pessoa' });
      this.belongsTo(models.Animal, { foreignKey: 'ownerId', constraints: false, as: 'animal' });
      this.belongsTo(models.Objeto, { foreignKey: 'ownerId', constraints: false, as: 'objeto' });
      this.belongsTo(models.Organizacao, { foreignKey: 'ownerId', constraints: false, as: 'organizacao' });
    }
  }
  AtributoPersonalizado.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    chave: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'O nome do campo personalizado (ex: "cor_olhos", "condicao_bateria").'
    },
    valor: {
      type: DataTypes.TEXT, // Valor será tratado como string por enquanto
      allowNull: false,
      comment: 'O valor do campo personalizado (ex: "azul", "80%").'
    },
    tipoDado: { // Para futuras validações ou renderização de UI
      type: DataTypes.ENUM('TEXTO', 'NUMERO', 'BOOLEANO', 'DATA', 'JSON'),
      defaultValue: 'TEXTO',
      allowNull: false,
      field: 'tipo_dado',
      comment: 'Define o tipo do dado para buscas e validações futuras.'
    },
    // ownerId e ownerType serão gerenciados pelas associações polimórficas
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false, // Deve ser sempre associado a um owner
    },
    ownerType: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Tipo do modelo ao qual este atributo pertence (Pessoa, Animal, Objeto, Organizacao).'
    }
  }, {
    sequelize,
    modelName: 'AtributoPersonalizado',
    tableName: 'atributos_personalizados',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });

  return AtributoPersonalizado;
};