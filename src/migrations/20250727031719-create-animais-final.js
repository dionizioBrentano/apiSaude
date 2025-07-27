'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('animais', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      nome: Sequelize.STRING,
      apelido: {
        type: Sequelize.STRING,
        allowNull: false
      },
      especie: Sequelize.STRING,
      raca: Sequelize.STRING,
      sexo: Sequelize.STRING,
      data_nascimento: Sequelize.DATEONLY,
      cor: Sequelize.STRING,
      tutor_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'pessoas',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('animais');
a  }
};
