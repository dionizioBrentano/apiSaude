// Definição do model 'Membro'
// Esta é uma tabela de junção (pivot table) que conecta Pessoas a Organizacoes,
// definindo o cargo e o status de cada membro.
module.exports = (sequelize, DataTypes) => {
  const Membro = sequelize.define('Membro', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    cargo: {
      type: DataTypes.ENUM('DONO', 'LIDER_EQUIPE', 'GERENTE', 'DEALER'),
      allowNull: false,
      comment: 'Nível hierárquico do membro dentro da organização.'
    },
    statusMembro: {
      type: DataTypes.ENUM('ATIVO', 'INATIVO'),
      defaultValue: 'ATIVO',
      allowNull: false,
    },
    // Os campos 'pessoaId' e 'organizacaoId' serão criados pelas associações.

  }, {
    // Opções do Model
    tableName: 'membros',
    timestamps: true,
    paranoid: true,
  });

    // Associações
  Membro.associate = function(models) {
    // Relação Membro -> Pessoa (Many-to-One)
    this.belongsTo(models.Pessoa, { foreignKey: 'pessoaId', as: 'pessoa' });
    // Relação Membro -> Organizacao (Many-to-One)
    this.belongsTo(models.Organizacao, { foreignKey: 'organizacaoId', as: 'organizacao' });
  };
  return Membro;
};