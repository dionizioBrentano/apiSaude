// Definição do model 'Vacina'
// Armazena o histórico de vacinação para um Animal.
module.exports = (sequelize, DataTypes) => {
  const Vacina = sequelize.define('Vacina', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    nomeVacina: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Nome da vacina aplicada (ex: V10, Antirrábica).'
    },
    dataAplicacao: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    dataProximaDose: {
      type: DataTypes.DATEONLY,
      comment: 'Data recomendada para a próxima dose ou reforço.'
    },
    lote: {
      type: DataTypes.STRING,
      comment: 'Lote da vacina aplicada.'
    },
    fabricante: {
      type: DataTypes.STRING,
    }
    // O campo 'animalId' será criado pela associação.

  }, {
    // Opções do Model
    tableName: 'vacinas',
    timestamps: true,
    paranoid: true,
  });

  //Associações

  Vacina.associate = function(models) {
    // Relação Vacina -> Animal (Many-to-One)
    this.belongsTo(models.Animal, { foreignKey: 'animalId', as: 'animal' });
  };

  return Vacina;
};

