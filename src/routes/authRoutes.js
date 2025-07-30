// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Rota para gerar o token anônimo
router.post('/iniciar-cadastro', AuthController.iniciarCadastro);

// Rota para o login de um usuário real
router.post('/login', AuthController.login);

module.exports = router;