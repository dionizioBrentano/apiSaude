// Definição do model 'Objeto'
module.exports = (sequelize, DataTypes) => {
  const Objeto = sequelize.define('Objeto', {
    // --- DADOS BÁSICOS DO OBJETO ---
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Categoria geral do objeto. Ex: Eletrônico, Jóia, Documento.'
    },
    marca: {
      type: DataTypes.STRING,
    },
    modelo: {
      type: DataTypes.STRING,
    },
    numeroSerie: {
      type: DataTypes.STRING,
      unique: true,
      comment: 'Número de série ou outro identificador único do objeto.'
    },
    descricao: {
      type: DataTypes.TEXT,
      comment: 'Descrição detalhada, características visíveis, etc.'
    },
    estadoGeral: {
      type: DataTypes.ENUM('NOVO', 'SEMINOVO', 'USADO_BOM_ESTADO', 'DANIFICADO'),
      comment: 'Condição geral do objeto.'
    },
    valorEstimado: {
      type: DataTypes.DECIMAL(10, 2), // Ex: 1500.00
      comment: 'Valor monetário estimado do objeto.'
    },
    
    // --- DADOS FISCAIS ---
    numeroNotaFiscal: {
      type: DataTypes.STRING,
      comment: 'Número da nota fiscal de compra, se aplicável.'
    },
    urlNotaFiscal: {
      type: DataTypes.STRING,
      comment: 'URL da imagem da nota fiscal, armazenada em nosso sistema.'
    },

  }, {
    // Opções do Model
    tableName: 'objetos',
    timestamps: true,
    paranoid: true,
  });

    // Associações

  Objeto.associate = function(models) {
    // Relação polimórfica Objeto -> EntidadeProtegida (One-to-One)
    this.hasOne(models.EntidadeProtegida, {
      foreignKey: 'entidadeId',
      constraints: false,
      scope: { tipo: 'OBJETO' },
      as: 'entidadeProtegida'
    });

    // Relação polimórfica Objeto -> Imagem (One-to-Many)
    this.hasMany(models.Imagem, {
      foreignKey: 'ownerId',
      constraints: false,
      scope: { ownerType: 'OBJETO' },
      as: 'imagens'
    });

    // Relação polimórfica Objeto -> AtributoPersonalizado (One-to-Many)
    this.hasMany(models.AtributoPersonalizado, {
      foreignKey: 'ownerId',
      constraints: false,
      scope: { ownerType: 'OBJETO' },
      as: 'atributos'
    });
  };

  return Objeto;
};

