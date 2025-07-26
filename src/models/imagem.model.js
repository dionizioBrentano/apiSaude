// Definição do model 'Imagem'
// Este model é polimórfico e pode se associar a Pessoas, Animais ou Objetos.
module.exports = (sequelize, DataTypes) => {
  const Imagem = sequelize.define('Imagem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'URL completa da imagem otimizada em um serviço de armazenamento (ex: S3).'
    },
    descricao: {
      type: DataTypes.TEXT,
      comment: 'Uma breve descrição ou legenda para a imagem.'
    },
    isPrincipal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Indica se esta é a imagem de perfil ou principal da entidade.'
    },
    // Os campos 'ownerId' e 'ownerType' que fazem a ligação polimórfica
    // serão criados dinamicamente pelas associações.

  }, {
    // Opções do Model
    tableName: 'imagens',
    timestamps: true,
    paranoid: true,
  });
  
  //Associações

  Imagem.associate = function(models) {
    // Relações polimórficas (pertence a um de vários models)
    this.belongsTo(models.Pessoa, { foreignKey: 'ownerId', constraints: false, as: 'pessoa' });
    this.belongsTo(models.Animal, { foreignKey: 'ownerId', constraints: false, as: 'animal' });
    this.belongsTo(models.Objeto, { foreignKey: 'ownerId', constraints: false, as: 'objeto' });
  };
  return Imagem;
};
