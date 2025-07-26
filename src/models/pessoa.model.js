// Importa a biblioteca de criptografia
const bcrypt = require('bcryptjs');


// Definição do model 'Pessoa'
module.exports = (sequelize, DataTypes) => {
  const Pessoa = sequelize.define('Pessoa', {
    // --- 1. DADOS DE LOGIN E SEGURANÇA ---
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefoneCelular: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    statusConta: {
      type: DataTypes.ENUM('ATIVA', 'INATIVA', 'SUSPENSA', 'PENDENTE_VERIFICACAO'),
      defaultValue: 'PENDENTE_VERIFICACAO',
      allowNull: false,
    },
    ultimoLogin: {
      type: DataTypes.DATE,
    },

    // --- 2. DADOS DE IDENTIFICAÇÃO PESSOAL ---
    nomeCompleto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nomeSocial: {
      type: DataTypes.STRING,
    },
    apelido: {
      type: DataTypes.STRING,
    },
    dataNascimento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    genero: {
      type: DataTypes.STRING,
    },
    nacionalidade: {
      type: DataTypes.STRING,
      defaultValue: 'Brasileira'
    },
    filiacao: {
        type: DataTypes.STRING,
    },

    // --- 3. DADOS DE CONTATO ---
    telefoneFixo: {
        type: DataTypes.STRING,
    },

    // --- 4. DADOS DE LOCALIZAÇÃO ---
    cep: { type: DataTypes.STRING },
    logradouro: { type: DataTypes.STRING },
    numero: { type: DataTypes.STRING },
    complemento: { type: DataTypes.STRING },
    bairro: { type: DataTypes.STRING },
    cidade: { type: DataTypes.STRING },
    estado: { type: DataTypes.STRING },
    pais: { type: DataTypes.STRING, defaultValue: 'Brasil' },

    // --- 5. DOCUMENTOS LEGAIS (BRASIL) ---
    cpf: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    situacaoCPF: {
        type: DataTypes.STRING,
    },
    rg: { type: DataTypes.STRING },
    rgOrgaoEmissor: { type: DataTypes.STRING },
    rgDataEmissao: { type: DataTypes.DATEONLY },
    cnh: { type: DataTypes.STRING },
    cnhCategoria: { type: DataTypes.STRING },
    cnhDataValidade: { type: DataTypes.DATEONLY },
    passaporte: { type: DataTypes.STRING },
    tituloEleitor: { type: DataTypes.STRING },
    pisPasep: { type: DataTypes.STRING },
    justificativaCpf: {
        type: DataTypes.TEXT,
    },

    // --- 6. DADOS DE SAÚDE (SENSÍVEIS) ---
    cartaoSUS: { type: DataTypes.STRING },
    tipoSanguineo: { type: DataTypes.STRING },
    alergias: { type: DataTypes.TEXT },
    condicoesMedicas: { type: DataTypes.TEXT },
    medicamentosUsoContinuo: { type: DataTypes.TEXT },
    contatoEmergenciaNome: { type: DataTypes.STRING },
    contatoEmergenciaTelefone: { type: DataTypes.STRING },

    // --- 7. DADOS DE TUTELA ---
    isTutelado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    
  }, {
    tableName: 'pessoas',
    timestamps: true,
    paranoid: true,
    
    hooks: {
      beforeCreate: async (pessoa) => {
        if (pessoa.senha) {
          const salt = await bcrypt.genSalt(10);
          pessoa.senha = await bcrypt.hash(pessoa.senha, salt);
        }
      },
      beforeUpdate: async (pessoa) => {
        if (pessoa.changed('senha')) {
          const salt = await bcrypt.genSalt(10);
          pessoa.senha = await bcrypt.hash(pessoa.senha, salt);
        }
      }
    }
  });

  // --- ASSOCIAÇÕES ---
  Pessoa.associate = function(models) {
    // Relação Pessoa (Tutor) -> RelacaoTutor (One-to-Many)
    this.hasMany(models.RelacaoTutor, { foreignKey: 'pessoaId', as: 'relacoesDeTutela' });
    // Relação Pessoa -> Membro (One-to-Many)
    this.hasMany(models.Membro, { foreignKey: 'pessoaId', as: 'participacoes' });
    // Relação Pessoa -> Consentimento (One-to-Many)
    this.hasMany(models.Consentimento, { foreignKey: 'pessoaId', as: 'consentimentos' });
    // Relação Pessoa (Tutelado) -> Pessoa (Tutor) (Many-to-One)
    this.belongsTo(models.Pessoa, { foreignKey: 'tutorId', as: 'tutor' });
    // Relação polimórfica Pessoa -> Imagem (One-to-Many)
    this.hasMany(models.Imagem, {
      foreignKey: 'ownerId',
      constraints: false,
      scope: { ownerType: 'PESSOA' },
      as: 'imagens'
    });
    // Relação polimórfica Pessoa -> AtributoPersonalizado (One-to-Many)
    this.hasMany(models.AtributoPersonalizado, {
      foreignKey: 'ownerId',
      constraints: false,
      scope: { ownerType: 'PESSOA' },
      as: 'atributos'
    });
  };

  // --- MÉTODOS DE INSTÂNCIA ---
  // CORREÇÃO: Movido para dentro do escopo da função.
Pessoa.prototype.validarSenha = async function (senha) {
  // 'this.senha' refere-se à senha com hash armazenada no banco de dados
  return bcrypt.compare(senha, this.senha);
};

  return Pessoa;
};
  