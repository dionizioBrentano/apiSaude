// Definição do model 'Animal'
module.exports = (sequelize, DataTypes) => {
  const Animal = sequelize.define('Animal', {
    // --- 1. IDENTIFICAÇÃO BÁSICA ---
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
      comment: 'Ex: SRD (Sem Raça Definida), Poodle, Siamês.'
    },
    corPredominante: {
      type: DataTypes.STRING,
      comment: 'Ex: Caramelo, Preto, Branco e Cinza.'
    },
    marcasDistintivas: {
      type: DataTypes.TEXT,
      comment: 'Características únicas. Ex: "Mancha branca na pata direita".'
    },

    // --- 2. CARACTERÍSTICAS FÍSICAS ---
    porte: {
      type: DataTypes.ENUM('MINI', 'PEQUENO', 'MEDIO', 'GRANDE', 'GIGANTE'),
      comment: 'Porte físico do animal.'
    },
    pesoAproximadoKg: {
      type: DataTypes.DECIMAL(5, 2), // Ex: 12.50 kg
      comment: 'Peso aproximado em quilogramas.'
    },
    dataNascimentoAproximada: {
      type: DataTypes.DATEONLY,
    },
    sexo: {
      type: DataTypes.ENUM('MACHO', 'FEMEA', 'NAO_SABE'),
    },
    isCastrado: {
      type: DataTypes.BOOLEAN,
    },
    microchipId: {
      type: DataTypes.STRING,
      comment: 'Número do microchip de identificação, se houver.'
    },

    // --- 3. SAÚDE E COMPORTAMENTO (DADOS SENSÍVEIS) ---
    comportamento: {
      type: DataTypes.TEXT,
      comment: 'Temperamento. Ex: "Dócil com crianças", "Assustado com estranhos".'
    },
    historicoSaude: {
      type: DataTypes.TEXT,
      comment: 'Condições pré-existentes ou observações importantes.'
    },
    medicamentosUsoContinuo: {
      type: DataTypes.TEXT,
      comment: 'Nome e dosagem dos medicamentos.'
    },
    alergiasConhecidas: {
      type: DataTypes.TEXT,
    },

    // --- 4. CONTATOS E REFERÊNCIAS VETERINÁRIAS ---
    clinicaVeterinariaPrincipal: {
      type: DataTypes.STRING,
    },
    medicoVeterinarioPrincipal: {
      type: DataTypes.STRING,
    },
    contatoEmergenciaVeterinaria: {
      type: DataTypes.STRING,
      comment: 'Telefone de emergência da clínica ou profissional.'
    },
    
  }, {
    tableName: 'animais',
    timestamps: true,
    paranoid: true,
  });

  // --- ASSOCIAÇÕES ---
  // Este bloco DEVE estar dentro da função module.exports
  Animal.associate = function(models) {
    // Relação Animal -> Vacina (One-to-Many)
    // Um Animal pode ter várias vacinas registradas.
    this.hasMany(models.Vacina, { foreignKey: 'animalId', as: 'vacinas' });

    // Relação polimórfica Animal -> EntidadeProtegida (One-to-One)
    this.hasOne(models.EntidadeProtegida, {
      foreignKey: 'entidadeId',
      constraints: false,
      scope: { tipo: 'ANIMAL' },
      as: 'entidadeProtegida'
    });

    // Relação polimórfica Animal -> Imagem (One-to-Many)
    this.hasMany(models.Imagem, {
      foreignKey: 'ownerId',
      constraints: false,
      scope: { ownerType: 'ANIMAL' },
      as: 'imagens'
    });

    // Relação polimórfica Animal -> AtributoPersonalizado (One-to-Many)
    this.hasMany(models.AtributoPersonalizado, {
      foreignKey: 'ownerId',
      constraints: false,
      scope: { ownerType: 'ANIMAL' },
      as: 'atributos'
    });
  };

  return Animal;
};