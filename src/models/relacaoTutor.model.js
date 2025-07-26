// Definição do model 'RelacaoTutor'
// Tabela de junção que define a relação entre um Tutor (Pessoa)
// e uma EntidadeProtegida (Pessoa, Animal ou Objeto).
module.exports = (sequelize, DataTypes) => {
  const RelacaoTutor = sequelize.define('RelacaoTutor', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    tipoRelacao: {
      type: DataTypes.STRING,
      defaultValue: 'TUTOR',
      comment: 'Tipo de relação (ex: Tutor, Curador, Responsável Legal).'
    }
    // Os campos 'pessoaId' e 'entidadeProtegidaId' serão criados pelas associações.

  }, {
    // Opções do Model
    tableName: 'relacoes_tutor',
    timestamps: true,
    paranoid: true,
  });

  //Associações
  RelacaoTutor.associate = function(models) {
    // Relação RelacaoTutor -> Pessoa (Many-to-One)
    this.belongsTo(models.Pessoa, { foreignKey: 'pessoaId', as: 'tutor' });
    // Relação RelacaoTutor -> EntidadeProtegida (Many-to-One)
    this.belongsTo(models.EntidadeProtegida, { foreignKey: 'entidadeProtegidaId', as: 'entidade' });
  };

  return RelacaoTutor;
};
