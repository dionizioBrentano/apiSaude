const express = require('express');
const router = express.Router();
const PessoaController = require('../controllers/PessoaController');
const AuthMiddleware = require('../middleware/AuthMiddleware');

// Rota pública para cadastro (original e funcional)
router.post('/', PessoaController.cadastrar);

// Rota protegida para obter o perfil do usuário (nova)
router.get('/me', AuthMiddleware, PessoaController.getProfile);

module.exports = router;
