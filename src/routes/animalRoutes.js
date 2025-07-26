const express = require('express');
const router = express.Router();
const AnimalController = require('../controllers/AnimalController');
const AuthMiddleware = require('../middleware/AuthMiddleware');

// Rota para criar um novo animal (protegida)
router.post('/', AuthMiddleware, AnimalController.criar);

// Rota para listar todos os animais (pública)
router.get('/', AnimalController.listarTodos);

// Rota para buscar um animal por ID (pública)
router.get('/:id', AnimalController.buscarPorId);


module.exports = router;