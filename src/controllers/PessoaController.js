// api/src/controllers/PessoaController.js

// Assumindo que você tem um modelo Pessoa configurado com Sequelize ou similar
// Exemplo: const { Pessoa, Organizacao, Membro } = require('../models'); 
// E um utilitário de JWT: const jwt = require('jsonwebtoken');
// E um utilitário de bcrypt para hash de senhas: const bcrypt = require('bcryptjs');

class PessoaController {
    /**
     * @route POST /api/v1/pessoas
     * @description Cadastra uma nova pessoa e cria sua organização raiz e vínculo de membro.
     * @access Public
     */
    static async cadastrar(req, res) {
        const { nomeCompleto, email, senha, telefoneCelular, dataNascimento, cpf } = req.body;

        try {
            // TODO: Adicione a lógica para verificar o standby_token aqui se ele vier no corpo da requisição
            // Se o standbyToken for um header, o middleware já deveria ter lidado com isso.

            // 1. Verificar se o email já existe
            // const pessoaExistente = await Pessoa.findOne({ where: { email } });
            // if (pessoaExistente) {
            //     return res.status(409).json({ message: 'E-mail já cadastrado.' });
            // }

            // 2. Hash da senha
            // const hashedPassword = await bcrypt.hash(senha, 10);

            // 3. Criar a Pessoa
            // const novaPessoa = await Pessoa.create({
            //     nomeCompleto,
            //     email,
            //     senha: hashedPassword, // Armazena a senha hash
            //     telefoneCelular,
            //     dataNascimento,
            //     cpf,
            //     statusConta: 'PENDENTE' // Status inicial da conta
            // });

            // 4. Criar a Organização Raiz (MyOrganization - US1.1)
            // const novaOrganizacao = await Organizacao.create({
            //     nome: `Organização de ${nomeCompleto}`,
            //     tipo: 'GRUPO',
            //     // organizacaoPaiId: null para o grupo raiz
            // });

            // 5. Criar o Vínculo de Membro para o líder (US1.1)
            // await Membro.create({
            //     organizacaoId: novaOrganizacao.id,
            //     pessoaId: novaPessoa.id,
            //     funcao: 'LIDER',
            //     isResponsavelPagamento: true
            // });

            // 6. Gerar token de login inicial (pode ser um token de ativação com tempo limitado)
            // Ou um token de login completo se a API já logar o usuário após cadastro
            // const token = jwt.sign({ id: novaPessoa.id, email: novaPessoa.email, statusConta: novaPessoa.statusConta }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // 7. Gerar link de validação (para simulação na bancada de testes)
            // const validationToken = jwt.sign({ id: novaPessoa.id, email: novaPessoa.email }, process.env.VALIDATION_SECRET, { expiresIn: '15m' });
            // const linkValidacaoParaTeste = `http://localhost:3333/api/v1/auth/validar-conta/${validationToken}`;

            // RESPOSTA SIMULADA (SUBSTITUA PELA LÓGICA ACIMA)
            const simulatedPessoaId = 'simulated-user-id-' + Math.random().toString(36).substring(7);
            const simulatedLoginToken = 'simulated-jwt-token-for-' + email;
            const simulatedValidationToken = 'simulated-validation-token-' + Math.random().toString(36).substring(7);
            const linkValidacaoParaTeste = `http://localhost:3333/api/v1/auth/validar-conta/${simulatedValidationToken}`;


            res.status(201).json({ 
                message: 'Pessoa cadastrada com sucesso! Verifique seu e-mail para ativar a conta.',
                pessoa: { id: simulatedPessoaId, email: email, nomeCompleto: nomeCompleto },
                token: simulatedLoginToken, // Este token pode ser um token de sessão, ou para o próximo passo de ativação
                linkValidacaoParaTeste: linkValidacaoParaTeste // APENAS PARA TESTES NA BANCADA
            });

        } catch (error) {
            console.error('Erro ao cadastrar pessoa:', error);
            res.status(500).json({ message: 'Erro interno do servidor ao cadastrar pessoa.', error: error.message });
        }
    }

    /**
     * @route PATCH /api/v1/pessoas/cpf
     * @description Atualiza o CPF de uma pessoa.
     * @access Private (Requer token de autenticação)
     */
    static async atualizarCpf(req, res) {
        const { email, cpf } = req.body; // Supondo que o CPF e o e-mail vêm no corpo da requisição
        const userIdFromToken = req.user.id; // Supondo que o ID do usuário está no token decodificado pelo middleware

        try {
            // TODO: Implemente a lógica real de atualização de CPF aqui
            // 1. Verificar se o CPF é válido (usar um validador de CPF, se aplicável)
            // 2. Buscar a pessoa pelo e-mail (ou pelo ID do token para maior segurança)
            //    const pessoa = await Pessoa.findOne({ where: { email } });
            //    if (!pessoa) {
            //        return res.status(404).json({ message: 'Pessoa não encontrada.' });
            //    }

            // 3. Opcional: Verificar se o userIdFromToken corresponde ao ID da pessoa encontrada pelo email
            //    if (pessoa.id !== userIdFromToken) {
            //        return res.status(403).json({ message: 'Não autorizado a alterar o CPF desta pessoa.' });
            //    }

            // 4. Verificar se o novo CPF já está em uso por outra pessoa
            //    const cpfExistente = await Pessoa.findOne({ where: { cpf } });
            //    if (cpfExistente && cpfExistente.id !== pessoa.id) {
            //        return res.status(409).json({ message: 'CPF já está em uso por outra conta.' });
            //    }

            // 5. Atualizar o CPF da pessoa
            //    pessoa.cpf = cpf;
            //    await pessoa.save();

            // RESPOSTA SIMULADA (SUBSTITUA PELA LÓGICA ACIMA)
            console.log(`Simulando atualização de CPF para ${email}: novo CPF ${cpf}`);
            res.status(200).json({ message: `CPF atualizado com sucesso para ${email}.`, novoCpf: cpf });

        } catch (error) {
            console.error('Erro ao atualizar CPF:', error);
            // Em caso de erro, retorne um status 500
            res.status(500).json({ message: 'Erro interno do servidor ao atualizar CPF.', error: error.message });
        }
    }

    // Outros métodos do controlador podem vir aqui (ex: getPessoaById, deletarPessoa, etc.)
}

module.exports = PessoaController;