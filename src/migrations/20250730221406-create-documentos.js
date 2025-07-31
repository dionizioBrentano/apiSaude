'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Documentos', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      pessoaId: { // Documento pertence a uma Pessoa
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Pessoas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tipoDocumento: { // Ex: RG, CNH, Passaporte, Certidão de Nascimento
        type: Sequelize.STRING,
        allowNull: false
      },
      numeroDocumento: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      dataEmissao: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      orgaoEmissor: {
        type: Sequelize.STRING,
        allowNull: true
      },
      urlDigitalizada: { // URL para o arquivo digitalizado
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Documentos');
  }
};