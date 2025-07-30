// src/models/PessoaModel.js
'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class Pessoa extends Model {
    static associate(models) {
      this.hasMany(models.Animal, { foreignKey: 'tutorId', as: 'animais' });
      this.hasMany(models.Membro, { foreignKey: 'pessoaId', as: 'afiliacoesOrganizacao' });
      this.hasMany(models.Organizacao, { foreignKey: 'criadorId', as: 'organizacoesCriadas' });
      this.hasMany(models.Documento, { foreignKey: 'pessoaId', as: 'documentos' });
      this.hasMany(models.Endereco, { foreignKey: 'pessoaId', as: 'enderecos' });
      this.hasMany(models.Imagem, {
        foreignKey: 'ownerId',
        constraints: false,
        scope: { ownerType: 'PESSOA' },
        as: 'imagens'
      });
      this.hasMany(models.AtributoPersonalizado, {
        foreignKey: 'ownerId',
        constraints: false,
        scope: { ownerType: 'PESSOA' },
        as: 'atributosPersonalizados'
      });
    }

    async validarSenha(senha) {
      return bcrypt.compare(senha, this.senha);
    }
  }
  Pessoa.init({
    id: { 
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true 
    },
    nomeCompleto: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'nome_completo',
      validate: {
        // Validação de nome completa será reativada ou refeita aqui depois, se necessário.
        // Por agora, ela está desativada.
      }
    },
    email: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true, 
      validate: { isEmail: true } 
    },
    senha: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    telefoneCelular: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true, 
      field: 'telefone_celular' 
    },
    dataNascimento: { 
      type: DataTypes.DATEONLY, 
      allowNull: true,
      field: 'data_nascimento' 
    },
    statusConta: { 
      type: DataTypes.STRING, 
      defaultValue: 'PENDENTE_VERIFICACAO', 
      field: 'status_conta' 
    },
    cpfHash: { 
      type: DataTypes.STRING, 
      unique: true, 
      allowNull: true,
      field: 'cpf_hash',
      comment: 'Hash irreversível do CPF para verificação de unicidade.'
    },
    ultimoLogin: { 
      type: DataTypes.DATE, 
      field: 'ultimo_login' 
    },
    // --- NOVOS CAMPOS PARA VALIDAÇÃO DE CONTA (US2.2) ---
    tokenValidacaoConta: {
      type: DataTypes.STRING,
      allowNull: true, // Será null após a validação
      unique: true, // Garante que cada token seja único
      field: 'token_validacao_conta',
      comment: 'Token único para validação de conta via email/WhatsApp.'
    },
    dataExpiracaoToken: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'data_expiracao_token',
      comment: 'Data e hora de expiração do token de validação de conta.'
    }
  }, {
    sequelize,
    modelName: 'Pessoa',
    tableName: 'pessoas',
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });

  Pessoa.beforeCreate(async (pessoa) => {
    if (pessoa.senha) {
      const salt = await bcrypt.genSalt(10);
      pessoa.senha = await bcrypt.hash(pessoa.senha, salt);
    }
  });

  return Pessoa;
};