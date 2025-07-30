// api/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Rota para iniciar o cadastro (obter token de standby)
router.post('/iniciar-cadastro', AuthController.iniciarCadastro);

// Rota para validar a conta via link/token (GET) - DESCOMENTADA E HABILITADA
router.get('/validar-conta/:token', AuthController.validarConta);

// Rota para login de usuário (US2.4)
router.post('/login', AuthController.login);

module.exports = router;