const { models } = require('../models');
const Pessoa = models.Pessoa;
const jwt = require('jsonwebtoken');

class AuthController {
    static async login(req, res) {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        }

        try {
            const pessoa = await Pessoa.findOne({ where: { email } });

            if (!pessoa) {
                // Mensagem genérica para não informar se o usuário existe ou não
                return res.status(401).json({ message: 'Credenciais inválidas.' });
            }

            // Assumindo que o seu model Pessoa tem um método 'validarSenha'
            // que compara a senha enviada com o hash salvo no banco.
            const senhaValida = await pessoa.validarSenha(senha);

            if (!senhaValida) {
                return res.status(401).json({ message: 'Credenciais inválidas.' });
            }

            // Se as credenciais são válidas, gerar o token JWT
            const payload = {
                id: pessoa.id,
                nome: pessoa.nomeCompleto,
                email: pessoa.email
            };

            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET, // Certifique-se que esta variável está no seu .env
                { expiresIn: process.env.JWT_EXPIRES_IN || '1d' } // E esta também
            );

            return res.status(200).json({
                message: 'Login bem-sucedido!',
                token: token
            });

        } catch (error) {
            console.error('Erro no processo de login:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
}

module.exports = AuthController;