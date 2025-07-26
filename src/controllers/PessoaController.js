const db = require('../models');
const Pessoa = db.models.Pessoa;
const { Op } = require('sequelize');

class PessoaController {
    /**
     * Controller para cadastrar um novo usuário.
     * (CÓDIGO ORIGINAL E FUNCIONAL)
     */
    static async cadastrar(req, res) {
        const { nomeCompleto, email, senha, telefoneCelular, dataNascimento } = req.body;

        if (!nomeCompleto || !email || !senha || !telefoneCelular || !dataNascimento) {
            return res.status(400).json({ message: 'Todos os campos obrigatórios (nomeCompleto, email, senha, telefoneCelular, dataNascimento) devem ser fornecidos.' });
        }

        try {
            const existingPessoa = await Pessoa.findOne({
                where: {
                    [Op.or]: [
                        { email: email },
                        { telefoneCelular: telefoneCelular }
                    ]
                }
            });

            if (existingPessoa) {
                let errorMessage = 'Já existe um cadastro com este ';
                if (existingPessoa.email === email && existingPessoa.telefoneCelular === telefoneCelular) {
                    errorMessage += 'e-mail e telefone celular.';
                } else if (existingPessoa.email === email) {
                    errorMessage += 'e-mail.';
                } else {
                    errorMessage += 'telefone celular.';
                }
                return res.status(409).json({ message: errorMessage });
            }

            const novaPessoa = await Pessoa.create({
                nomeCompleto,
                email,
                senha,
                telefoneCelular,
                dataNascimento,
                statusConta: 'PENDENTE_VERIFICACAO'
            });

            const { senha: _, ...pessoaSemSenha } = novaPessoa.toJSON();

            return res.status(201).json({
                message: 'Usuário cadastrado com sucesso! Verificação pendente.',
                user: pessoaSemSenha
            });

        } catch (error) {
            console.error('Erro ao cadastrar pessoa:', error);
            return res.status(500).json({ message: 'Erro interno do servidor ao cadastrar a pessoa.', error: error.message });
        }
    }

    /**
     * Controller para retornar os dados do perfil do usuário logado.
     * (NOVO MÉTODO ADICIONADO)
     */
    static async getProfile(req, res) {
        const userId = req.user.id;
        
        try {
            const pessoa = await Pessoa.findByPk(userId, {
                attributes: { exclude: ['senha'] } // Exclui a senha da resposta
            });

            if (!pessoa) {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }

            return res.status(200).json(pessoa);

        } catch (error) {
            console.error('Erro ao buscar perfil:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
}

module.exports = PessoaController;