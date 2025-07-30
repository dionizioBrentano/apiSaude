// src/models/Objeto.model.js
module.exports = (sequelize, DataTypes) => {
  const Objeto = sequelize.define('Objeto', {
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
      allowNull: true,
    },
    modelo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    numeroSerie: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
      comment: 'Número de série ou outro identificador único do objeto.'
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Descrição detalhada, características visíveis, etc.'
    },
    estadoGeral: {
      type: DataTypes.ENUM('NOVO', 'SEMINOVO', 'USADO_BOM_ESTADO', 'DANIFICADO'),
      allowNull: true,
      comment: 'Condição geral do objeto.'
    },
    valorEstimado: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Valor monetário estimado do objeto.'
    },
    numeroNotaFiscal: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Número da nota fiscal de compra, se aplicável.'
    },
    urlNotaFiscal: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'URL da imagem da nota fiscal, armazenada em nosso sistema.'
    },
    tutorId: { // Chave estrangeira para a Pessoa tutora
      type: DataTypes.UUID,
      allowNull: true,
      field: 'tutor_id'
    },
    organizacaoId: { // Chave estrangeira para a Organização/Grupo proprietária
      type: DataTypes.UUID,
      allowNull: true,
      field: 'organizacao_id'
    }
  }, {
    tableName: 'objetos',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });

  Objeto.associate = function(models) {
    this.belongsTo(models.Pessoa, { foreignKey: 'tutorId', as: 'tutor' });
    this.belongsTo(models.Organizacao, { foreignKey: 'organizacaoId', as: 'organizacao' });

    this.hasMany(models.Imagem, {
      foreignKey: 'ownerId',
      constraints: false,
      scope: { ownerType: 'OBJETO' },
      as: 'imagens'
    });
    this.hasMany(models.AtributoPersonalizado, {
      foreignKey: 'ownerId',
      constraints: false,
      scope: { ownerType: 'OBJETO' },
      as: 'atributosPersonalizados'
    });
    // Relação polimórfica Objeto -> EntidadeProtegida (One-to-One)
    this.hasOne(models.EntidadeProtegida, {
      foreignKey: 'entidadeId',
      constraints: false,
      scope: { tipo: 'OBJETO' },
      as: 'entidadeProtegida'
    });
  };

  return Objeto;
};