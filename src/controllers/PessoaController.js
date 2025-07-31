// api/src/controllers/PessoaController.js

const db = require('../models');
const Pessoa = db.Pessoa;
const Organizacao = db.Organizacao; // <--- FIX: Corrigido de Organizaceo para Organizacao
const Membro = db.Membro;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validarCPF } = require('../utils/cpfValidator');

class PessoaController {
    /**
     * @route POST /api/v1/pessoas
     * @description Cadastra uma nova pessoa e cria sua organização raiz e vínculo de membro.
     * @access Public
     */
    static async cadastrar(req, res, next) {
        console.log('[PessoaController.cadastrar] Iniciando processo de cadastro de pessoa.');
        const { nomeCompleto, email, senha, telefoneCelular, dataNascimento, cpf } = req.body;

        try {
            // 1. Verificar se o email já existe
            const pessoaExistente = await Pessoa.findOne({ where: { email } });
            if (pessoaExistente) {
                console.warn('[PessoaController.cadastrar] Falha no cadastro: E-mail já cadastrado. E-mail: ' + email);
                return res.status(409).json({ message: 'E-mail já cadastrado.' });
            }
            console.log('[PessoaController.cadastrar] E-mail não cadastrado, prosseguindo... ' + email);

            // 2. Hash da senha
            const hashedPassword = await bcrypt.hash(senha, 10);
            console.log('[PessoaController.cadastrar] Senha hashed com sucesso.');

            // 3. Hash do CPF (se fornecido) e Verificação de Unicidade
            let cpfHash = null;
            if (cpf) {
                console.log('[PessoaController.cadastrar] CPF fornecido, validando formato...');
                if (!validarCPF(cpf)) {
                    console.warn('[PessoaController.cadastrar] CPF fornecido é inválido (formato/dígitos): ' + cpf);
                    return res.status(400).json({ message: 'CPF inválido. Verifique o formato ou os dígitos.' });
                }
                
                const todasAsPessoas = await Pessoa.findAll(); 
                let cpfJaEmUso = false;
                for (const p of todasAsPessoas) {
                    if (p.cpf_hash && await bcrypt.compare(cpf, p.cpf_hash)) { 
                        cpfJaEmUso = true;
                        console.warn('[PessoaController.cadastrar] CPF já em uso por outra pessoa: ' + cpf);
                        break;
                    }
                }
                
                if (cpfJaEmUso) {
                    return res.status(409).json({ message: 'CPF já está em uso por outra conta.' });
                }

                cpfHash = await bcrypt.hash(cpf, 10);
                console.log('[PessoaController.cadastrar] CPF hashed com sucesso: ' + cpf);
            } else {
                console.log('[PessoaController.cadastrar] CPF não fornecido.');
            }

            // 4. Criar a Pessoa no banco de dados
            console.log('[PessoaController.cadastrar] Criando nova Pessoa no banco de dados...');
            const novaPessoa = await Pessoa.create({
                nomeCompleto,
                email,
                senha: hashedPassword,
                telefoneCelular,
                dataNascimento: dataNascimento || null,
                cpf_hash: cpfHash,
                statusConta: 'PENDENTE'
            });
            console.log(`[PessoaController.cadastrar] Pessoa criada com ID: ${novaPessoa.id}. Email: ${novaPessoa.email}`);

            // 5. Criar a Organização Raiz (MyOrganization - US1.1)
            console.log(`[PessoaController.cadastrar] Criando organização raiz para Pessoa ID: ${novaPessoa.id}...`);
            const novaOrganizacao = await Organizacao.create({
                nome: `Organização de ${nomeCompleto.split(' ')[0]}`,
                tipo: 'GRUPO',
                criadorId: novaPessoa.id, // Passando o ID do criador
            });
            console.log(`[PessoaController.cadastrar] Organização raiz criada com ID: ${novaOrganizacao.id}.`);

            // 6. Criar o Vínculo de Membro para o líder (US1.1)
            console.log(`[PessoaController.cadastrar] Criando vínculo de membro (LIDER) para Pessoa ID: ${novaPessoa.id} e Org ID: ${novaOrganizacao.id}...`);
            await Membro.create({
                organizacaoId: novaOrganizacao.id,
                pessoaId: novaPessoa.id,
                funcao: 'LIDER',
                isResponsavelPagamento: true
            });
            console.log('[PessoaController.cadastrar] Vínculo de membro criado com sucesso.');

            // 7. Gerar token de validação real para ativação de conta (US2.2)
            console.log('[PessoaController.cadastrar] Gerando token de validação de conta real...');
            const validationToken = jwt.sign(
                { id: novaPessoa.id, email: novaPessoa.email, type: 'ACCOUNT_VALIDATION' },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            const linkValidacaoParaTeste = `http://localhost:3333/api/v1/auth/validar-conta/${validationToken}`;
            console.log(`[PessoaController.cadastrar] Link de validação gerado: ${linkValidacaoParaTeste}`);

            // 8. Gerar token de login inicial (para simplificar o fluxo da bancada de testes)
            const loginPayload = {
                id: novaPessoa.id,
                email: novaPessoa.email,
                statusConta: novaPessoa.statusConta
            };
            const loginToken = jwt.sign(
                loginPayload,
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
            );
            console.log('[PessoaController.cadastrar] Token de login inicial gerado.');

            res.status(201).json({ 
                message: 'Pessoa cadastrada com sucesso! Verifique seu e-mail para ativar a conta.',
                pessoa: { 
                    id: novaPessoa.id, 
                    email: novaPessoa.email, 
                    nomeCompleto: novaPessoa.nomeCompleto,
                    statusConta: novaPessoa.statusConta
                },
                // Inclua o ID da organização raiz na resposta para que o frontend possa capturar o ID
                organizacaoRaizId: novaOrganizacao.id, // <-- FIX: Retornando o ID da organização raiz aqui
                token: loginToken,
                linkValidacaoParaTeste: linkValidacaoParaTeste
            });

        } catch (error) {
            console.error('[PessoaController.cadastrar] Erro ao cadastrar pessoa:', error.message);
            console.error('[PessoaController.cadastrar] Stack Trace do Erro:', error.stack);
            if (error.name === 'SequelizeValidationError') {
                error.errors.forEach(err => console.error(`[PessoaController.cadastrar] Detalhes da Validação: ${err.path} - ${err.message}`));
            }
            next(error);
        }
    }

    /**
     * @route PATCH /api/v1/pessoas/cpf
     * @description Atualiza o CPF de uma pessoa.
     * @access Private (Requer token de autenticação)
     */
    static async atualizarCpf(req, res, next) {
        const { email, cpf } = req.body;
        const userIdFromToken = req.user.id;

        try {
            // 1. Validar formato e dígitos do CPF
            if (!validarCPF(cpf)) {
                return res.status(400).json({ message: 'CPF inválido. Verifique o formato ou os dígitos.' });
            }

            // 2. Buscar a pessoa pelo ID do token
            const pessoa = await Pessoa.findByPk(userIdFromToken);
            if (!pessoa) {
                return res.status(404).json({ message: 'Pessoa não encontrada ou token inválido.' });
            }

            // 3. Verificar se o CPF já está em uso por outra pessoa (comparando hashes)
            const todasAsPessoas = await Pessoa.findAll();
            let cpfJaEmUsoPorOutro = false;
            for (const p of todasAsPessoas) {
                if (p.id !== pessoa.id && p.cpf_hash && await bcrypt.compare(cpf, p.cpf_hash)) {
                    cpfJaEmUsoPorOutro = true;
                    break;
                }
            }

            if (cpfJaEmUsoPorOutro) {
                return res.status(409).json({ message: 'CPF já está em uso por outra conta.' });
            }

            // 4. Hash do novo CPF e atualização
            const newCpfHash = await bcrypt.hash(cpf, 10);
            pessoa.cpf_hash = newCpfHash;
            await pessoa.save();

            res.status(200).json({ message: `CPF atualizado com sucesso para ${email}.`, novoCpf: cpf });

        } catch (error) {
            console.error('[PessoaController.atualizarCpf] Erro ao atualizar CPF:', error);
            next(error);
        }
    }
}

module.exports = PessoaController;