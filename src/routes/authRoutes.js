const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Define a rota POST para /login
router.post('/login', AuthController.login);

module.exports = router;