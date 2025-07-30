'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('animais', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      apelido: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      especie: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      raca: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cor_predominante: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      marcas_distintivas: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      porte: {
        type: Sequelize.ENUM('MINI', 'PEQUENO', 'MEDIO', 'GRANDE', 'GIGANTE'),
        allowNull: true,
      },
      peso_aproximado_kg: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      data_nascimento_aproximada: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      sexo: {
        type: Sequelize.ENUM('MACHO', 'FEMEA', 'NAO_SABE'),
        allowNull: true,
      },
      is_castrado: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      microchip_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      comportamento: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      historico_saude: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      medicamentos_uso_continuo: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      alergias_conhecidas: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      clinica_veterinaria_principal: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      medico_veterinario_principal: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      contato_emergencia_veterinaria: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tutor_id: { // FK para a Pessoa tutora
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'pessoas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      organizacao_id: { // FK para a Organização/Grupo proprietária
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'organizacoes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('animais');
  }
};