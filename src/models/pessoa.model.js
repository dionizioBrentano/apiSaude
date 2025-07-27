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
    nomeCompleto: { type: DataTypes.STRING, allowNull: false, field: 'nome_completo' },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    senha: { type: DataTypes.STRING, allowNull: false },
    telefoneCelular: { type: DataTypes.STRING, allowNull: false, unique: true, field: 'telefone_celular' },
    dataNascimento: { type: DataTypes.DATEONLY, allowNull: false, field: 'data_nascimento' },
    statusConta: { type: DataTypes.STRING, defaultValue: 'PENDENTE_VERIFICACAO', field: 'status_conta' },
    ultimoLogin: { type: DataTypes.DATE, field: 'ultimo_login' },
    nomeSocial: { type: DataTypes.STRING, field: 'nome_social' },
    apelido: { type: DataTypes.STRING },
    genero: { type: DataTypes.STRING },
    nacionalidade: { type: DataTypes.STRING },
    filiacao: { type: DataTypes.STRING },
    telefoneFixo: { type: DataTypes.STRING, field: 'telefone_fixo' },
    cep: { type: DataTypes.STRING },
    logradouro: { type: DataTypes.STRING },
    numero: { type: DataTypes.STRING },
    complemento: { type: DataTypes.STRING },
    bairro: { type: DataTypes.STRING },
    cidade: { type: DataTypes.STRING },
    estado: { type: DataTypes.STRING },
    pais: { type: DataTypes.STRING },
    cpf: { type: DataTypes.STRING, unique: true },
    situacaoCPF: { type: DataTypes.STRING, field: 'situacao_c_p_f' },
    rg: { type: DataTypes.STRING },
    rgOrgaoEmissor: { type: DataTypes.STRING, field: 'rg_orgao_emissor' },
    rgDataEmissao: { type: DataTypes.DATEONLY, field: 'rg_data_emissao' },
    cnh: { type: DataTypes.STRING },
    cnhCategoria: { type: DataTypes.STRING, field: 'cnh_categoria' },
    cnhDataValidade: { type: DataTypes.DATEONLY, field: 'cnh_data_validade' },
    passaporte: { type: DataTypes.STRING },
    tituloEleitor: { type: DataTypes.STRING, field: 'titulo_eleitor' },
    pisPasep: { type: DataTypes.STRING, field: 'pis_pasep' },
    justificativaCpf: { type: DataTypes.STRING, field: 'justificativa_cpf' },
    cartaoSUS: { type: DataTypes.STRING, field: 'cartao_s_u_s' },
    tipoSanguineo: { type: DataTypes.STRING, field: 'tipo_sanguineo' },
    alergias: { type: DataTypes.TEXT },
    condicoesMedicas: { type: DataTypes.TEXT, field: 'condicoes_medicas' },
    medicamentosUsoContinuo: { type: DataTypes.TEXT, field: 'medicamentos_uso_continuo' },
    contatoEmergenciaNome: { type: DataTypes.STRING, field: 'contato_emergencia_nome' },
    contatoEmergenciaTelefone: { type: DataTypes.STRING, field: 'contato_emergencia_telefone' },
    isTutelado: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_tutelado' },
    tutorId: { type: DataTypes.UUID, field: 'tutor_id' },
    deletedAt: { type: DataTypes.DATE, field: 'deleted_at' }
  }, {
    sequelize,
    modelName: 'Pessoa',
    tableName: 'pessoas',
    paranoid: true, // Habilita o soft delete (usa a coluna deleted_at)
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