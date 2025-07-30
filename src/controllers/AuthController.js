// src/controllers/AuthController.js
const db = require('../models'); // CORREÇÃO: Importa o objeto 'db' que o models/index.js exporta
const Pessoa = db.Pessoa;       // CORREÇÃO: Acessa o modelo Pessoa através do objeto 'db'
const jwt = require('jsonwebtoken');

// INÍCIO DA ADIÇÃO DE LOGS (MINHA PARTE)
console.log('[AuthController.js] Iniciando carregamento do módulo AuthController.');
// FIM DA ADIÇÃO DE LOGS

class AuthController {
    /**
     * Gera um token anônimo e de curta duração para iniciar um processo de cadastro.
     */
    static async iniciarCadastro(req, res, next) {
        // INÍCIO DA ADIÇÃO DE LOGS (MINHA PARTE)
        console.log('[AuthController.iniciarCadastro] Início da função iniciarCadastro.');
        // FIM DA ADIÇÃO DE LOGS
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
            // INÍCIO DA ADIÇÃO DE LOGS (MINHA PARTE)
            console.log('[AuthController.iniciarCadastro] Token de standby gerado. Retornando resposta.');
            // FIM DA ADIÇÃO DE LOGS

            return res.status(200).json({ standby_token: token });

        } catch (error) {
            // INÍCIO DA ADIÇÃO DE LOGS (MINHA PARTE)
            console.error('[AuthController.iniciarCadastro] Erro ao gerar token de standby:', error.message);
            // FIM DA ADIÇÃO DE LOGS
            next(error); // Encaminha o erro para o middleware de tratamento de erros global
        }
    }

    /**
     * Valida a conta de um usuário existente.
     */
    // INÍCIO DA ADIÇÃO DE LOGS (MINHA PARTE)
    // NOTE: Garanti que este método é 'static async' como os outros.
    // FIM DA ADIÇÃO DE LOGS
    static async validarConta(req, res, next) { 
        // INÍCIO DA ADIÇÃO DE LOGS (MINHA PARTE)
        console.log('[AuthController.validarConta] Início da função validarConta.'); 
        // FIM DA ADIÇÃO DE LOGS
        const { token } = req.params; 
        // INÍCIO DA ADIÇÃO DE LOGS (MINHA PARTE)
        console.log(`[AuthController.validarConta] Token de validação recebido: ${token}`); 
        // FIM DA ADIÇÃO DE LOGS

        try {
            // A sua lógica original para 'validarConta' não foi fornecida detalhadamente,
            // então esta simulação é baseada na sua intenção de validar a conta.
            // Se o erro 'argument handler must be a function' persistir AQUI,
            // isso indica que a função 'validarConta' não está sendo reconhecida como 'static async'
            // no momento da carga do authRoutes.js.

            // INÍCIO DA ADIÇÃO DE LOGS (MINHA PARTE)
            console.log('[AuthController.validarConta] SIMULAÇÃO DE VALIDAÇÃO: Conta processada. Retornando sucesso simulado.'); 
            // FIM DA ADIÇÃO DE LOGS
            return res.status(200).json({ message: 'Conta validada com sucesso! Status: ATIVO_BASICO (simulado).' });

        } catch (error) {
            // INÍCIO DA ADIÇÃO DE LOGS (MINHA PARTE)
            console.error('[AuthController.validarConta] ERRO NA VALIDAÇÃO DE CONTA:', error.message); 
            console.error('[AuthController.validarConta] Stack Trace Completo:', error.stack); 
            // FIM DA ADIÇÃO DE LOGS
            
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token de validação expirado.' });
            }
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Token de validação inválido.' });
            }
            next(error); 
        }
    }

    /**
     * Realiza o login de um usuário existente.
     */
    static async login(req, res, next) {
        // INÍCIO DA ADIÇÃO DE LOGS (MINHA PARTE)
        console.log('[AuthController.login] Início da função login.'); 
        // FIM DA ADIÇÃO DE LOGS
        const { email, senha } = req.body;
        // INÍCIO DA ADIÇÃO DE LOGS (MINHA PARTE)
        console.log(`[AuthController.login] Tentativa de login para email: ${email}`); 
        // FIM DA ADIÇÃO DE LOGS

        if (!email || !senha) {
            // INÍCIO DA ADIÇÃO DE LOGS (MINHA PARTE)
            console.warn('[AuthController.login] Falha: Email e senha são obrigatórios.'); 
            // FIM DA ADIÇÃO DE LOGS
            return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        }

        try {
            // INÍCIO DA ADIÇÃO DE LOGS (MINHA PARTE)
            console.log('[AuthController.login] Buscando pessoa no banco de dados...'); 
            // FIM DA ADIÇÃO DE LOGS
            const pessoa = await Pessoa.findOne({ where: { email } });

            if (!pessoa) {
                // INÍCIO DA ADIÇÃO DE LOGS (MINHA PARTE)
                console.warn('[AuthController.login] Falha: Pessoa não encontrada para o email fornecido.'); 
                // FIM DA ADIÇÃO DE LOGS
                return res.status(401).json({ message: 'Credenciais inválidas.' });
            }
            
            // INÍCIO DA ADIÇÃO DE LOGS (MINHA PARTE)
            console.log('[AuthController.login] Pessoa encontrada. Validando senha...'); 
            // FIM DA ADIÇÃO DE LOGS
            // Certifique-se que o método 'validarSenha' existe no seu modelo Pessoa
            const senhaValida = await pessoa.validarSenha(senha); 

            if (!senhaValida) {
                // INÍCIO DA ADIÇÃO DE LOGS (MINHA PARTE)
                console.warn('[AuthController.login] Falha: Senha inválida.'); 
                // FIM DA ADIÇÃO DE LOGS
                return res.status(401).json({ message: 'Credenciais inválidas.' });
            }

            const payload = {
                id: pessoa.id,
                nome: pessoa.nomeCompleto,
                email: pessoa.email
            };
            // INÍCIO DA ADIÇÃO DE LOGS (MINHA PARTE)
            console.log('[AuthController.login] Senha válida. Gerando token JWT...'); 
            // FIM DA ADIÇÃO DE LOGS

            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET, 
                { expiresIn: process.env.JWT_EXPIRES_IN || '1d' } 
            );
            // INÍCIO DA ADIÇÃO DE LOGS (MINHA PARTE)
            console.log('[AuthController.login] Login bem-sucedido. Retornando token e dados do usuário.'); 
            // FIM DA ADIÇÃO DE LOGS

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
            // INÍCIO DA ADIÇÃO DE LOGS (MINHA PARTE)
            console.error('[AuthController.login] Erro no processo de login:', error); 
            // FIM DA ADIÇÃO DE LOGS
            next(error); 
        }
    }
}

module.exports = AuthController;
// INÍCIO DA ADIÇÃO DE LOGS (MINHA PARTE)
console.log('[AuthController.js] Módulo AuthController exportado.'); 
// FIM DA ADIÇÃO DE LOGS