// Definição do model 'AtributoPersonalizado'
// Este model é polimórfico e armazena dados flexíveis no formato chave-valor
// para qualquer outra entidade principal (Pessoa, Animal, Objeto).
module.exports = (sequelize, DataTypes) => {
  const AtributoPersonalizado = sequelize.define('AtributoPersonalizado', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    chave: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'O nome do campo personalizado (ex: "gume", "nível_energia").'
    },
    valor: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'O valor do campo personalizado (ex: "diamantado", "alto").'
    },
    tipoDado: {
      type: DataTypes.ENUM('TEXTO', 'NUMERO', 'BOOLEANO', 'DATA'),
      defaultValue: 'TEXTO',
      allowNull: false,
      comment: 'Define o tipo do dado para buscas e validações futuras.'
    },
    // Os campos 'ownerId' e 'ownerType' que fazem a ligação polimórfica
    // serão criados dinamicamente pelas associações.

  }, {
    // Opções do Model
    tableName: 'atributos_personalizados',
    timestamps: true,
    paranoid: true,
  });



  //Associações
  AtributoPersonalizado.associate = function(models) {
    // Relações polimórficas (pertence a um de vários models)
    this.belongsTo(models.Pessoa, { foreignKey: 'ownerId', constraints: false, as: 'pessoa' });
    this.belongsTo(models.Animal, { foreignKey: 'ownerId', constraints: false, as: 'animal' });
    this.belongsTo(models.Objeto, { foreignKey: 'ownerId', constraints: false, as: 'objeto' });
  };

  return AtributoPersonalizado;
};