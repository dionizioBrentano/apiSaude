'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs'); // Importa bcryptjs para o método validarSenha

module.exports = (sequelize, DataTypes) => {
  class Pessoa extends Model {
    static associate(models) {
      Pessoa.hasMany(models.Membro, { foreignKey: 'pessoaId', as: 'membros' });
      Pessoa.hasMany(models.Documento, { foreignKey: 'pessoaId', as: 'documentos' });
      Pessoa.hasMany(models.Endereco, { foreignKey: 'pessoaId', as: 'enderecos' });
      Pessoa.hasMany(models.Imagem, { foreignKey: 'ownerId', scope: { ownerType: 'Pessoa' }, as: 'imagens' });
      Pessoa.hasMany(models.AuditoriaLog, { foreignKey: 'usuarioId', as: 'auditoriaLogs' });
    }
  }
  Pessoa.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    nomeCompleto: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false
    },
    telefoneCelular: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dataNascimento: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    cpf_hash: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true
    },
    statusConta: {
      type: DataTypes.ENUM('PENDENTE', 'ATIVO_BASICO', 'ATIVO_COMPLETO', 'BLOQUEADO'),
      defaultValue: 'PENDENTE',
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Pessoa',
    tableName: 'pessoas', // <-- CORREÇÃO: Força o nome da tabela para 'pessoas' em minúsculas
    paranoid: true // Habilita soft delete
  });

  // Método de instância para validar senha (usado no login)
  Pessoa.prototype.validarSenha = async function(senha) {
      return await bcrypt.compare(senha, this.senha);
  };

  return Pessoa;
};