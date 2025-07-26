// Definição do model 'Consentimento'
// Gerencia as permissões de uso de dados para cada Pessoa, em conformidade com a LGPD.
module.exports = (sequelize, DataTypes) => {
  const Consentimento = sequelize.define('Consentimento', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    tipoConsentimento: {
      type: DataTypes.ENUM('TERMOS_DE_USO', 'POLITICA_PRIVACIDADE', 'OFERTAS_MARKETING'),
      allowNull: false,
      comment: 'O tipo específico de consentimento que foi dado.'
    },
    consentimentoConcedido: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    versaoDocumento: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Versão do documento (Termos, Política) que foi aceita.'
    }
    // O campo 'pessoaId' será criado pela associação.

  }, {
    // Opções do Model
    tableName: 'consentimentos',
    timestamps: true, // Registra a data em que o consentimento foi dado/revogado
    paranoid: true,
  });

  //Associações:
  Consentimento.associate = function(models) {
    // Relação Consentimento -> Pessoa (Many-to-One)
    this.belongsTo(models.Pessoa, { foreignKey: 'pessoaId', as: 'pessoa' });
  };
  return Consentimento;
};