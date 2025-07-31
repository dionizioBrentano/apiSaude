// src/controllers/AuthController.js
const db = require('../models');
const Pessoa = db.Pessoa;
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
                { expiresIn: '15m' }
            );

            return res.status(200).json({ standby_token: token });

        } catch (error) {
            console.error('[AuthController.iniciarCadastro] Erro ao gerar token de standby:', error.message);
            next(error);
        }
    }

    /**
     * Valida a conta de um usuário existente.
     */
    static async validarConta(req, res, next) { 
        const { token } = req.params; 

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (decoded.type !== 'ACCOUNT_VALIDATION' || !decoded.id || !decoded.email) {
                return res.status(400).json({ message: 'Link de validação inválido.' });
            }

            const pessoa = await Pessoa.findByPk(decoded.id);

            if (!pessoa) {
                return res.status(404).json({ message: 'Link de validação inválido ou expirado. Pessoa não encontrada.' });
            }

            if (pessoa.statusConta !== 'PENDENTE') {
                return res.status(400).json({ message: 'Sua conta já foi validada ou está em um status que impede a validação básica.' });
            }

            pessoa.statusConta = 'ATIVO_BASICO';
            await pessoa.save();

            return res.status(200).json({ message: 'Conta validada com sucesso! Status: ATIVO_BASICO.' });

        } catch (error) {
            console.error('[AuthController.validarConta] Erro na validação de conta real:', error.message); 
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Link de validação expirado.' });
            }
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Link de validação inválido.' });
            }
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

            const bcrypt = require('bcryptjs');
            const senhaValida = await bcrypt.compare(senha, pessoa.senha); 

            if (!senhaValida) {
                return res.status(401).json({ message: 'Credenciais inválidas.' });
            }

            if (pessoa.statusConta === 'PENDENTE') {
                return res.status(403).json({ message: 'Sua conta ainda não foi validada. Verifique seu e-mail.' });
            }
            if (pessoa.statusConta === 'BLOQUEADO') {
                return res.status(403).json({ message: 'Sua conta está bloqueada. Entre em contato com o suporte.' });
            }

            const payload = {
                id: pessoa.id,
                nome: pessoa.nomeCompleto,
                email: pessoa.email,
                statusConta: pessoa.statusConta
            };

            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET, 
                { expiresIn: process.env.JWT_EXPIRES_IN || '1d' } 
            );

            return res.status(200).json({
                message: 'Login bem-sucedido!',
                token: token,
                user: { 
                    id: pessoa.id,
                    nome: pessoa.nomeCompleto,
                    email: pessoa.email,
                    statusConta: pessoa.statusConta
                }
            });

        } catch (error) {
            console.error('[AuthController.login] Erro no processo de login:', error);
            next(error);
        }
    }
}

module.exports = AuthController;