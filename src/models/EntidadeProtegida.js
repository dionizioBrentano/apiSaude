// src/models/EntidadeProtegida.model.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EntidadeProtegida extends Model {
    static associate(models) {
      // Relação polimórfica (pertence a uma Pessoa, Animal ou Objeto)
      this.belongsTo(models.Pessoa, { foreignKey: 'entidadeId', constraints: false, as: 'pessoaAssociada' });
      this.belongsTo(models.Animal, { foreignKey: 'entidadeId', constraints: false, as: 'animalAssociado' });
      this.belongsTo(models.Objeto, { foreignKey: 'entidadeId', constraints: false, as: 'objetoAssociado' });
      
      // Relacionamento com a Organização/Grupo proprietária da Entidade Protegida
      this.belongsTo(models.Organizacao, { foreignKey: 'organizacaoId', as: 'organizacaoProprietaria' });

      // Relação com a Pessoa que comprou/ativou o QR Code
      this.belongsTo(models.Pessoa, { foreignKey: 'compradorQrCodeId', as: 'compradorQrCode' });
      
      // Relação com imagens (se o QR code em si for uma imagem aqui, ou links para a página)
      // this.hasMany(models.Imagem, { foreignKey: 'ownerId', constraints: false, scope: { ownerType: 'ENTIDADE_PROTEGIDA' }, as: 'imagensQrCode' });
    }
  }
  EntidadeProtegida.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    urlPublicaHash: { // O identificador único para a URL pública
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'url_publica_hash',
      comment: 'Hash único usado na URL para acessar a página pública da entidade.'
    },
    tipoEntidade: { // O tipo da entidade que esta EntidadeProtegida representa
      type: DataTypes.ENUM('PESSOA', 'ANIMAL', 'OBJETO'),
      allowNull: false,
      field: 'tipo_entidade',
      comment: 'Define o tipo da entidade associada (Pessoa, Animal ou Objeto).'
    },
    status: { // Status da URL/QR Code (ativo, pendente de pagamento, inativo)
      type: DataTypes.ENUM('PENDENTE_ATIVACAO', 'ATIVO', 'INATIVO'),
      defaultValue: 'PENDENTE_ATIVACAO',
      allowNull: false,
      comment: 'Status da ativação da URL/QR Code (PENDENTE_ATIVACAO, ATIVO, INATIVO).'
    },
    isPago: { // Preparação para pagamentos: indica se o QR Code foi pago
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      field: 'is_pago',
      comment: 'Indica se a ativação da Entidade Protegida foi paga.'
    },
    cupomUtilizado: { // Preparação para pagamentos: se um cupom foi usado
      type: DataTypes.STRING,
      allowNull: true,
      field: 'cupom_utilizado',
      comment: 'Código do cupom utilizado para ativar esta Entidade Protegida.'
    },
    dataAtivacao: { // Data em que o QR Code foi ativado (pago ou por cupom)
      type: DataTypes.DATE,
      allowNull: true,
      field: 'data_ativacao'
    },
    configuracaoExibicao: { // JSONB para configurar quais campos serão exibidos publicamente
      type: DataTypes.JSON, // JSONB é mais performático para MySQL 8+, TEXT para versões anteriores
      allowNull: true,
      field: 'configuracao_exibicao',
      comment: 'Configuração JSON para quais dados da entidade devem ser exibidos publicamente.'
    },
    // Chaves estrangeiras para a entidade associada e para a organização proprietária
    entidadeId: { // ID da Pessoa, Animal ou Objeto real
      type: DataTypes.UUID,
      allowNull: false,
      field: 'entidade_id'
    },
    organizacaoId: { // ID da Organização/Grupo proprietária
      type: DataTypes.UUID,
      allowNull: false,
      field: 'organizacao_id'
    },
    compradorQrCodeId: { // ID da Pessoa que fez a compra/ativação (pode ser o criador ou outro membro)
      type: DataTypes.UUID,
      allowNull: true,
      field: 'comprador_qrcode_id'
    }
  }, {
    sequelize,
    modelName: 'EntidadeProtegida',
    tableName: 'entidades_protegidas',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });

  return EntidadeProtegida;
};