// src/controllers/PessoaController.js
const db = require('../models');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const bcrypt = require('bcryptjs'); // Importar bcryptjs para o hash do CPF
// Importar função de validação de CPF (vamos criar/ajustar isso em utils)
const { validarCPF } = require('../utils/cpfValidator'); // Caminho a ser verificado/criado

const PessoaController = {
  async cadastrarPessoa(req, res) {
    console.log('Requisição recebida em /api/v1/pessoas');
    try {
      const { nomeCompleto, email, senha, telefoneCelular } = req.body;

      if (!nomeCompleto || !email || !senha || !telefoneCelular) {
        console.error('Erro de validação: Campos obrigatórios faltando.');
        return res.status(400).json({ error: 'Todos os campos obrigatórios (nomeCompleto, email, senha, telefoneCelular) devem ser fornecidos.' });
      }

      const result = await db.sequelize.transaction(async (t) => {
        console.log('Iniciando transação para criar Pessoa, Organizacao e Membro.');

        const novaPessoa = await db.Pessoa.create({
          nomeCompleto,
          email,
          senha,
          telefoneCelular,
          statusConta: 'PENDENTE_VERIFICACAO',
          tokenValidacaoConta: uuidv4(),
          dataExpiracaoToken: moment().add(24, 'hours').toDate(),
        }, { transaction: t });
        console.log('Pessoa criada:', novaPessoa.id);

        const novaOrganizacao = await db.Organizacao.create({
          nome: `${novaPessoa.nomeCompleto}'s Group`,
          tipo: 'GRUPO',
          criadorId: novaPessoa.id,
        }, { transaction: t });
        console.log('Organização criada:', novaOrganizacao.id);

        await db.Membro.create({
          pessoaId: novaPessoa.id,
          organizacaoId: novaOrganizacao.id,
          funcao: 'LIDER',
          isResponsavelPagamento: true,
        }, { transaction: t });
        console.log('Membro criado para Pessoa:', novaPessoa.id, 'e Organizacao:', novaOrganizacao.id);

        const linkValidacao = `http://localhost:${process.env.PORT || 3333}/api/v1/validar-conta?token=${novaPessoa.tokenValidacaoConta}`;
        console.log(`--- SIMULAÇÃO: LINK DE VALIDAÇÃO ENVIADO PARA ${novaPessoa.telefoneCelular}: ${linkValidacao} ---`);

        return {
          pessoa: novaPessoa,
          organizacao: novaOrganizacao,
          linkValidacao
        };
      });

      console.log('Transação concluída com sucesso. Retornando resposta 201.');
      res.status(201).json({
        message: 'Pessoa e grupo padrão cadastrados com sucesso! Link de validação enviado por WhatsApp.',
        pessoa: {
          id: result.pessoa.id,
          nomeCompleto: result.pessoa.nomeCompleto,
          email: result.pessoa.email,
          telefoneCelular: result.pessoa.telefoneCelular,
          statusConta: result.pessoa.statusConta
        },
        organizacao: {
          id: result.organizacao.id,
          nome: result.organizacao.nome,
          tipo: result.organizacao.tipo
        },
        linkValidacaoParaTeste: result.linkValidacao
      });

    } catch (error) {
      console.error('------- ERRO NO CADASTRO DE PESSOA E GRUPO -------');
      console.error('Tipo de Erro:', error.name);
      console.error('Mensagem de Erro:', error.message);
      if (error.errors) {
        console.error('Detalhes do Erro (Sequelize):', error.errors.map(e => ({ path: e.path, message: e.message })));
      }
      if (error.stack) {
        console.error('Stack Trace:', error.stack);
      }
      console.error('----------------------------------------------------');

      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ error: 'Email ou telefone celular já cadastrado.', details: error.errors });
      }
      if (error.name === 'SequelizeValidationError') {
        const validationError = error.errors.find(e => e.message.includes('validação'));
        if (validationError) {
          return res.status(400).json({ error: validationError.message });
        }
      }
      res.status(500).json({ error: 'Erro interno do servidor ao cadastrar pessoa e grupo.', details: error.message });
    }
  },

  async validarConta(req, res) {
    console.log('--- [VALIDAR CONTA CONTROLLER] Recebida requisição para validar conta ---');
    try {
      const { token } = req.query;

      if (!token) {
        console.error('[VALIDAR CONTA CONTROLLER] Erro: Token de validação não fornecido.');
        return res.status(400).json({ error: 'Token de validação não fornecido.' });
      }

      const pessoa = await db.Pessoa.findOne({
        where: { tokenValidacaoConta: token }
      });

      if (!pessoa) {
        console.error('[VALIDAR CONTA CONTROLLER] Erro: Token de validação inválido ou já utilizado.', { token });
        return res.status(404).json({ error: 'Token de validação inválido ou já utilizado.' });
      }

      if (moment().isAfter(pessoa.dataExpiracaoToken)) {
        console.error('[VALIDAR CONTA CONTROLLER] Erro: Token de validação expirado.', { token, dataExpiracao: pessoa.dataExpiracaoToken });
        return res.status(400).json({ error: 'Token de validação expirado. Por favor, solicite um novo link.' });
      }

      pessoa.statusConta = 'ATIVO_BASICO';
      pessoa.tokenValidacaoConta = null;
      pessoa.dataExpiracaoToken = null;
      await pessoa.save();

      console.log(`--- [VALIDAR CONTA CONTROLLER] Conta da Pessoa ${pessoa.id} validada com sucesso para ATIVO_BASICO. ---`);
      res.status(200).json({ message: 'Sua conta foi validada com sucesso! Você já pode acessar as funcionalidades básicas.' });

    } catch (error) {
      console.error('------- ERRO AO VALIDAR CONTA -------');
      console.error('Tipo de Erro:', error.name);
      console.error('Mensagem de Erro:', error.message);
      if (error.stack) {
        console.error('Stack Trace:', error.stack);
      }
      console.error('----------------------------------------------------');
      res.status(500).json({ error: 'Erro interno do servidor ao validar sua conta.', details: error.message });
    }
  },

  // --- NOVA FUNÇÃO PARA ATUALIZAR CPF (US2.3) ---
  async atualizarCpf(req, res) {
    console.log('--- [ATUALIZAR CPF CONTROLLER] Recebida requisição para atualizar CPF ---');
    try {
      const { email, cpf } = req.body; // Vamos usar o email para identificar a pessoa por enquanto

      if (!email || !cpf) {
        console.error('[ATUALIZAR CPF CONTROLLER] Erro: Email e CPF são obrigatórios.');
        return res.status(400).json({ error: 'Email e CPF são obrigatórios para atualizar.' });
      }

      // Validação do formato do CPF
      if (!validarCPF(cpf)) {
        console.error('[ATUALIZAR CPF CONTROLLER] Erro: Formato de CPF inválido.', { cpf });
        return res.status(400).json({ error: 'CPF inválido. Por favor, insira um CPF válido.' });
      }

      // Verificar se a Pessoa existe e se o status da conta permite atualização de CPF
      const pessoa = await db.Pessoa.findOne({
        where: { email: email }
      });

      if (!pessoa) {
        console.error('[ATUALIZAR CPF CONTROLLER] Erro: Pessoa não encontrada para o email fornecido.', { email });
        return res.status(404).json({ error: 'Pessoa não encontrada.' });
      }

      // Apenas pessoas com status ATIVO_BASICO podem atualizar o CPF para ATIVO_COMPLETO
      if (pessoa.statusConta !== 'ATIVO_BASICO') {
        console.error(`[ATUALIZAR CPF CONTROLLER] Erro: Conta não está no status ATIVO_BASICO para atualização de CPF. Status atual: ${pessoa.statusConta}.`);
        return res.status(403).json({ error: 'Sua conta precisa estar validada (status ATIVO_BASICO) para adicionar o CPF.' });
      }

      // Iniciar transação para o hash e atualização
      const result = await db.sequelize.transaction(async (t) => {
        // Hashing irreversível do CPF
        const salt = await bcrypt.genSalt(10);
        const cpfHashed = await bcrypt.hash(cpf, salt);
        console.log('[ATUALIZAR CPF CONTROLLER] CPF hashed com sucesso.');

        // Verificar unicidade do CPF Hashed (prevenindo duplicatas)
        const cpfExistente = await db.Pessoa.findOne({
          where: { cpfHash: cpfHashed },
          transaction: t
        });

        if (cpfExistente && cpfExistente.id !== pessoa.id) {
          console.error('[ATUALIZAR CPF CONTROLLER] Erro: CPF já cadastrado por outra pessoa.', { cpfHashed });
          throw new Error('CPF já cadastrado por outra pessoa. Cada CPF deve ser único no sistema.');
        }

        // Atualizar a Pessoa com o CPF Hashed e status
        pessoa.cpfHash = cpfHashed;
        pessoa.statusConta = 'ATIVO_COMPLETO';
        await pessoa.save({ transaction: t });
        console.log(`[ATUALIZAR CPF CONTROLLER] CPF da Pessoa ${pessoa.id} atualizado. Status: ATIVO_COMPLETO.`);

        // TODO: AuditoriaLog - Registrar a atualização do CPF aqui (US2.5)

        return pessoa;
      });

      res.status(200).json({
        message: 'CPF atualizado com sucesso! Sua conta agora está completa e habilitada para todas as funcionalidades.',
        pessoa: {
          id: result.id,
          nomeCompleto: result.nomeCompleto,
          email: result.email,
          statusConta: result.statusConta
          // Não retornar o cpfHash por segurança
        }
      });

    } catch (error) {
      console.error('------- ERRO AO ATUALIZAR CPF -------');
      console.error('Tipo de Erro:', error.name);
      console.error('Mensagem de Erro:', error.message);
      if (error.errors) {
        console.error('Detalhes do Erro (Sequelize):', error.errors.map(e => ({ path: e.path, message: e.message })));
      }
      if (error.stack) {
        console.error('Stack Trace:', error.stack);
      }
      console.error('----------------------------------------------------');

      if (error.message.includes('CPF já cadastrado')) { // Erro customizado
        return res.status(409).json({ error: error.message });
      }
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ error: 'CPF já cadastrado.', details: error.errors });
      }
      res.status(500).json({ error: 'Erro interno do servidor ao atualizar CPF.', details: error.message });
    }
  },

  // Outras funções do controller de Pessoa virão aqui...
};

module.exports = PessoaController;