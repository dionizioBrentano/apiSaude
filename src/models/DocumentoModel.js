// src/models/Documento.model.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Documento extends Model {
    static associate(models) {
      this.belongsTo(models.Pessoa, { foreignKey: 'pessoaId', as: 'pessoa' });
    }
  }
  Documento.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    tipoDocumento: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Tipo do documento (ex: RG, CNH, Passaporte, Certidão de Nascimento).'
    },
    numero: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Número do documento.'
    },
    orgaoEmissor: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'orgao_emissor',
      comment: 'Órgão emissor do documento (ex: SSP/UF).'
    },
    dataEmissao: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'data_emissao',
    },
    ufEmissao: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: 'uf_emissao',
      comment: 'UF de emissão do documento (se aplicável, ex: SP, MG).'
    },
    urlDigitalizacao: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'url_digitalizacao',
      comment: 'URL da imagem digitalizada do documento.'
    },
    pessoaId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'pessoa_id',
    }
  }, {
    sequelize,
    modelName: 'Documento',
    tableName: 'documentos',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });

  return Documento;
};