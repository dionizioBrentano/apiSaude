'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pessoas', {
      id: { allowNull: false, primaryKey: true, type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
      nome_completo: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      senha: { type: Sequelize.STRING, allowNull: false },
      telefone_celular: { type: Sequelize.STRING, allowNull: false, unique: true },
      data_nascimento: { type: Sequelize.DATEONLY, allowNull: false },
      status_conta: { type: Sequelize.STRING, defaultValue: 'PENDENTE_VERIFICACAO' },
      ultimo_login: { type: Sequelize.DATE, allowNull: true },
      nome_social: { type: Sequelize.STRING, allowNull: true },
      apelido: { type: Sequelize.STRING, allowNull: true },
      genero: { type: Sequelize.STRING, allowNull: true },
      nacionalidade: { type: Sequelize.STRING, allowNull: true },
      filiacao: { type: Sequelize.STRING, allowNull: true },
      telefone_fixo: { type: Sequelize.STRING, allowNull: true },
      cep: { type: Sequelize.STRING, allowNull: true },
      logradouro: { type: Sequelize.STRING, allowNull: true },
      numero: { type: Sequelize.STRING, allowNull: true },
      complemento: { type: Sequelize.STRING, allowNull: true },
      bairro: { type: Sequelize.STRING, allowNull: true },
      cidade: { type: Sequelize.STRING, allowNull: true },
      estado: { type: Sequelize.STRING, allowNull: true },
      pais: { type: Sequelize.STRING, allowNull: true },
      cpf: { type: Sequelize.STRING, unique: true, allowNull: true },
      situacao_c_p_f: { type: Sequelize.STRING, allowNull: true },
      rg: { type: Sequelize.STRING, allowNull: true },
      rg_orgao_emissor: { type: Sequelize.STRING, allowNull: true },
      rg_data_emissao: { type: Sequelize.DATEONLY, allowNull: true },
      cnh: { type: Sequelize.STRING, allowNull: true },
      cnh_categoria: { type: Sequelize.STRING, allowNull: true },
      cnh_data_validade: { type: Sequelize.DATEONLY, allowNull: true },
      passaporte: { type: Sequelize.STRING, allowNull: true },
      titulo_eleitor: { type: Sequelize.STRING, allowNull: true },
      pis_pasep: { type: Sequelize.STRING, allowNull: true },
      justificativa_cpf: { type: Sequelize.STRING, allowNull: true },
      cartao_s_u_s: { type: Sequelize.STRING, allowNull: true },
      tipo_sanguineo: { type: Sequelize.STRING, allowNull: true },
      alergias: { type: Sequelize.TEXT, allowNull: true },
      condicoes_medicas: { type: Sequelize.TEXT, allowNull: true },
      medicamentos_uso_continuo: { type: Sequelize.TEXT, allowNull: true },
      contato_emergencia_nome: { type: Sequelize.STRING, allowNull: true },
      contato_emergencia_telefone: { type: Sequelize.STRING, allowNull: true },
      is_tutelado: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: true },
      tutor_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'pessoas', key: 'id' },
        onDelete: 'SET NULL'
      },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE },
      deleted_at: { type: Sequelize.DATE, allowNull: true }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pessoas');
  }
};
