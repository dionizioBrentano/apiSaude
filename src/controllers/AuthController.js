// src/controllers/AuthController.js
const db = require('../models'); // CORREÇÃO: Importa o objeto 'db' que o models/index.js exporta
const Pessoa = db.Pessoa;       // CORREÇÃO: Acessa o modelo Pessoa através do objeto 'db'
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
                process.env.JWT_SECRET, // Certifique-se que JWT_SECRET está definido no seu .env
                { expiresIn: '15m' } // Validade curta de 15 minutos
            );

            return res.status(200).json({ standby_token: token });

        } catch (error) {
            next(error); // Encaminha o erro para o middleware de tratamento de erros global
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
            
            // Certifique-se que o método 'validarSenha' existe no seu modelo Pessoa
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
                process.env.JWT_SECRET, // Certifique-se que JWT_SECRET está definido no seu .env
                { expiresIn: process.env.JWT_EXPIRES_IN || '1d' } // Validade do token de login
            );

            return res.status(200).json({
                message: 'Login bem-sucedido!',
                token: token,
                user: { // Retorna algumas informações do usuário logado
                    id: pessoa.id,
                    nome: pessoa.nomeCompleto,
                    email: pessoa.email,
                    statusConta: pessoa.statusConta
                }
            });

        } catch (error) {
            console.error('Erro no processo de login:', error);
            next(error); // Encaminha o erro para o middleware de tratamento de erros global
        }
    }
}

module.exports = AuthController;