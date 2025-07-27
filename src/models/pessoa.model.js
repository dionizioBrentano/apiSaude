'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class Pessoa extends Model {
    static associate(models) {
      this.hasMany(models.Animal, { foreignKey: 'tutorId', as: 'animais' });
    }
    async validarSenha(senha) {
      return bcrypt.compare(senha, this.senha);
    }
  }
  Pessoa.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    nomeCompleto: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'nome_completo',
      validate: {
        nomeEsobrenome(value) {
          const names = value.trim().split(' ');
          if (names.length < 2) {
            throw new Error('O nome completo deve conter pelo menos nome e sobrenome.');
          }
          names.forEach(name => {
            if (name.length < 2) {
              throw new Error('Cada parte do nome deve ter pelo menos 2 caracteres.');
            }
          });
        }
      }
    },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    senha: { type: DataTypes.STRING, allowNull: false },
    telefoneCelular: { type: DataTypes.STRING, allowNull: false, unique: true, field: 'telefone_celular' },
    dataNascimento: { type: DataTypes.DATEONLY, allowNull: false, field: 'data_nascimento' },
    statusConta: { type: DataTypes.STRING, defaultValue: 'PENDENTE_VERIFICACAO', field: 'status_conta' },
    cpf: { type: DataTypes.STRING, unique: true, allowNull: true },
    // ... (incluir todos os outros campos do model que já tínhamos definido)
    ultimoLogin: { type: DataTypes.DATE, field: 'ultimo_login' },
    deletedAt: { type: DataTypes.DATE, field: 'deleted_at' }
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