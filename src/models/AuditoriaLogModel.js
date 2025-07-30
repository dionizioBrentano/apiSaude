// src/models/AuditoriaLog.model.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AuditoriaLog extends Model {
    static associate(models) {
      this.belongsTo(models.Pessoa, { foreignKey: 'usuarioId', as: 'usuario' });
      // Outras associações polimórficas se necessário para entidade_afetada_id
    }
  }
  AuditoriaLog.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    usuarioId: { // Quem realizou a ação
      type: DataTypes.UUID,
      allowNull: true, // Pode ser nulo para ações do sistema ou não autenticadas
      field: 'usuario_id',
    },
    tipoAcao: {
      type: DataTypes.STRING, // Ex: 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'ACESSO_PUBLICO', 'PAGAMENTO_APROVADO'
      allowNull: false,
      field: 'tipo_acao',
    },
    entidadeAfetadaTipo: { // Tipo do modelo afetado (Pessoa, Animal, Organizacao, etc.)
      type: DataTypes.STRING,
      allowNull: true,
      field: 'entidade_afetada_tipo',
    },
    entidadeAfetadaId: { // ID da instância do modelo afetado
      type: DataTypes.UUID,
      allowNull: true,
      field: 'entidade_afetada_id',
    },
    dadosAnteriores: { // Estado anterior do registro (para UPDATE/DELETE)
      type: DataTypes.JSON,
      allowNull: true,
      field: 'dados_anteriores',
    },
    dadosNovos: { // Novo estado do registro (para CREATE/UPDATE)
      type: DataTypes.JSON,
      allowNull: true,
      field: 'dados_novos',
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'ip_address',
    }
  }, {
    sequelize,
    modelName: 'AuditoriaLog',
    tableName: 'auditoria_logs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    // Não usamos paranoid: true aqui porque logs de auditoria não devem ser "soft deleted"
  });

  return AuditoriaLog;
};