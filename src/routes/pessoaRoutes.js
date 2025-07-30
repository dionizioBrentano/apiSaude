// src/routes/pessoasRoutes.js
const express = require('express');
const router = express.Router();
const PessoaController = require('../controllers/PessoaController');
const AuthMiddleware = require('../middleware/AuthMiddleware'); // Certifique-se do caminho correto para este middleware

// Rota pública para cadastro (original e funcional)
router.post('/', PessoaController.cadastrarPessoa); // Ajustado para o nome do método em PessoaController

// Rota protegida para obter o perfil do usuário (nova)
router.get('/me', AuthMiddleware, PessoaController.getProfile); // Assumindo que você tem um método getProfile

// CORREÇÃO: Rota para atualização de CPF (PATCH /api/v1/pessoas/cpf)
// NOTA: Esta rota espera um token de autenticação, portanto, inclui AuthMiddleware.
// O PessoaController.atualizarCpf espera 'email' e 'cpf' no body.
router.patch('/cpf', AuthMiddleware, PessoaController.atualizarCpf);

module.exports = router;