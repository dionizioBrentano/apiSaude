'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Evento extends Model {
    static associate(models) {
      // Define a associação com a tabela Pessoas
      this.belongsTo(models.Pessoa, { foreignKey: 'executadoPorUsuarioId', as: 'usuario' });
    }
  }
  Evento.init({
    entidadeId: DataTypes.INTEGER,
    tipoEvento: DataTypes.STRING,
    dadosEvento: DataTypes.JSON,
    executadoPorUsuarioId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Evento',
  });
  return Evento;
};