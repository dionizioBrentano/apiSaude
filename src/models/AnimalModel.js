// src/models/Animal.model.js
module.exports = (sequelize, DataTypes) => {
  const Animal = sequelize.define('Animal', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    apelido: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'O nome pelo qual o pet atende.'
    },
    especie: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Ex: Cachorro, Gato, Ave, etc.'
    },
    raca: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Ex: SRD (Sem Raça Definida), Poodle, Siamês.'
    },
    corPredominante: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Ex: Caramelo, Preto, Branco e Cinza.'
    },
    marcasDistintivas: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Características únicas. Ex: "Mancha branca na pata direita".'
    },
    porte: {
      type: DataTypes.ENUM('MINI', 'PEQUENO', 'MEDIO', 'GRANDE', 'GIGANTE'),
      allowNull: true,
      comment: 'Porte físico do animal.'
    },
    pesoAproximadoKg: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Peso aproximado em quilogramas.'
    },
    dataNascimentoAproximada: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    sexo: {
      type: DataTypes.ENUM('MACHO', 'FEMEA', 'NAO_SABE'),
      allowNull: true,
    },
    isCastrado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    microchipId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Número do microchip de identificação, se houver.'
    },
    comportamento: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Temperamento. Ex: "Dócil com crianças", "Assustado com estranhos".'
    },
    historicoSaude: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Condições pré-existentes ou observações importantes.'
    },
    medicamentosUsoContinuo: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Nome e dosagem dos medicamentos.'
    },
    alergiasConhecidas: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    clinicaVeterinariaPrincipal: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    medicoVeterinarioPrincipal: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contatoEmergenciaVeterinaria: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Telefone de emergência da clínica ou profissional.'
    },
    tutorId: { // Chave estrangeira para a Pessoa tutora
      type: DataTypes.UUID,
      allowNull: true, // Pode ser null se a propriedade primária for da Organização
      field: 'tutor_id'
    },
    organizacaoId: { // Chave estrangeira para a Organização/Grupo proprietária
      type: DataTypes.UUID,
      allowNull: true,
      field: 'organizacao_id'
    }
  }, {
    tableName: 'animais',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });

  Animal.associate = function(models) {
    this.belongsTo(models.Pessoa, { foreignKey: 'tutorId', as: 'tutor' });
    this.belongsTo(models.Organizacao, { foreignKey: 'organizacaoId', as: 'organizacao' });

    this.hasMany(models.Imagem, {
      foreignKey: 'ownerId',
      constraints: false,
      scope: { ownerType: 'ANIMAL' },
      as: 'imagens'
    });
    this.hasMany(models.AtributoPersonalizado, {
      foreignKey: 'ownerId',
      constraints: false,
      scope: { ownerType: 'ANIMAL' },
      as: 'atributosPersonalizados'
    });
    // Relação polimórfica Animal -> EntidadeProtegida (One-to-One)
    this.hasOne(models.EntidadeProtegida, {
      foreignKey: 'entidadeId',
      constraints: false,
      scope: { tipo: 'ANIMAL' },
      as: 'entidadeProtegida'
    });
    // Se houver Vacina, adicione aqui (Vacina.model.js precisa ser criado)
    // this.hasMany(models.Vacina, { foreignKey: 'animalId', as: 'vacinas' });
  };

  return Animal;
};