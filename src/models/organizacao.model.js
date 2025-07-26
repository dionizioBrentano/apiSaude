// Definição do model 'Organizacao'
module.exports = (sequelize, DataTypes) => {
  const Organizacao = sequelize.define('Organizacao', {
    // --- DADOS BÁSICOS ---
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM('GRUPO', 'ORGANIZACAO'),
      allowNull: false,
      comment: 'Define se é um grupo informal ou uma organização formal com CNPJ.'
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Nome do grupo ou Razão Social da organização.'
    },
    nomeFantasia: {
      type: DataTypes.STRING,
      comment: 'Nome fantasia da organização.'
    },

    // --- CAMPOS ESPECÍFICOS PARA TIPO 'ORGANIZACAO' ---
    cnpj: {
      type: DataTypes.STRING,
      unique: true,
      comment: 'CNPJ da organização. Obrigatório se o tipo for ORGANIZACAO.'
    },
    situacaoCNPJ: {
      type: DataTypes.STRING,
      comment: 'Situação do CNPJ na Receita Federal (ex: ATIVA).'
    },
    dataAbertura: {
      type: DataTypes.DATEONLY,
      comment: 'Data de fundação da empresa.'
    },
    cnaePrincipal: {
      type: DataTypes.STRING,
      comment: 'Código da atividade econômica principal.'
    },
    naturezaJuridica: {
      type: DataTypes.STRING,
    },

    // --- DADOS DE LOCALIZAÇÃO (ENDEREÇO COMERCIAL) ---
    cep: { type: DataTypes.STRING },
    logradouro: { type: DataTypes.STRING },
    numero: { type: DataTypes.STRING },
    complemento: { type: DataTypes.STRING },
    bairro: { type: DataTypes.STRING },
    cidade: { type: DataTypes.STRING },
    estado: { type: DataTypes.STRING },
    pais: { type: DataTypes.STRING, defaultValue: 'Brasil' },

    // O campo 'criadorId' (para tipo 'GRUPO') será adicionado via associação
    // para manter o código do model limpo e centralizar os relacionamentos.
    
  }, {
    // Opções do Model
    tableName: 'organizacoes',
    timestamps: true,
    paranoid: true,
  });

  // Associações

  Organizacao.associate = function(models) {
    // Relação Organizacao -> Membro (One-to-Many)
    // Uma Organização é composta por muitos Membros.
    this.hasMany(models.Membro, { foreignKey: 'organizacaoId', as: 'membros' });

    // Relação Organizacao (Grupo) -> Pessoa (Criador) (Many-to-One)
    // Um Grupo é criado por uma Pessoa.
    this.belongsTo(models.Pessoa, { foreignKey: 'criadorId', as: 'criador' });
  };

  return Organizacao;
};

