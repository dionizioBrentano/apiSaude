// Definição do model 'EntidadeProtegida'
// Esta é uma tabela central que representa qualquer item (Pessoa, Animal, Objeto)
// que pode ter um QR Code associado.
module.exports = (sequelize, DataTypes) => {
  const EntidadeProtegida = sequelize.define('EntidadeProtegida', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    publicId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'ID público, curto e seguro, usado na URL do QR Code (ex: k7f9x2p).'
    },
    tipo: {
      type: DataTypes.ENUM('PESSOA', 'ANIMAL', 'OBJETO'),
      allowNull: false,
      comment: 'Define o tipo da entidade associada (Pessoa, Animal ou Objeto).'
    },
    status: {
      type: DataTypes.ENUM('ATIVO', 'PERDIDO', 'ENCONTRADO', 'EM_ALERTA'),
      allowNull: false,
      defaultValue: 'ATIVO',
      comment: 'Status atual da entidade (ex: se foi reportada como perdida).'
    },
    // O campo 'entidadeId' que faz a ligação polimórfica será criado
    // dinamicamente pelas associações para manter o código limpo.

  }, {
    // Opções do Model
    tableName: 'entidades_protegidas',
    timestamps: true,
    paranoid: true,
  });

  //Associações

  EntidadeProtegida.associate = function(models) {
    // Relação EntidadeProtegida -> RelacaoTutor (One-to-Many)
    // Uma entidade pode ter vários tutores/responsáveis.
    this.hasMany(models.RelacaoTutor, { foreignKey: 'entidadeProtegidaId', as: 'tutores' });

    // Relações polimórficas (pertence a um de vários models)
    this.belongsTo(models.Pessoa, { foreignKey: 'entidadeId', constraints: false, as: 'detalhesPessoa' });
    this.belongsTo(models.Animal, { foreignKey: 'entidadeId', constraints: false, as: 'detalhesAnimal' });
    this.belongsTo(models.Objeto, { foreignKey: 'entidadeId', constraints: false, as: 'detalhesObjeto' });
  };
  return EntidadeProtegida;
};

