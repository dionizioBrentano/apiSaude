const { models } = require('../models');
const Pessoa = models.Pessoa;
const jwt = require('jsonwebtoken');

class AuthController {
    /**
     * Gera um token anônimo e de curta duração para iniciar um processo de cadastro.
     */
    static async iniciarCadastro(req, res, next) {
        try {
            const payload = {
                type: 'STANDBY',
                timestamp: Date.now()
            };

            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '15m' } // Validade curta de 15 minutos
            );

            return res.status(200).json({ standby_token: token });

        } catch (error) {
            next(error);
        }
    }

    /**
     * Realiza o login de um usuário existente.
     */
    static async login(req, res, next) {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        }

        try {
            const pessoa = await Pessoa.findOne({ where: { email } });

            if (!pessoa) {
                return res.status(401).json({ message: 'Credenciais inválidas.' });
            }
            
            const senhaValida = await pessoa.validarSenha(senha);

            if (!senhaValida) {
                return res.status(401).json({ message: 'Credenciais inválidas.' });
            }

            const payload = {
                id: pessoa.id,
                nome: pessoa.nomeCompleto,
                email: pessoa.email
            };

            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
            );

            return res.status(200).json({
                message: 'Login bem-sucedido!',
                token: token
            });

        } catch (error) {
            console.error('Erro no processo de login:', error);
            next(error);
        }
    }
}

module.exports = AuthController;