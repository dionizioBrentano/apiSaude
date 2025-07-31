// api/src/routes/organizacaoRoutes.js
const express = require('express');
const router = express.Router();
const OrganizacaoController = require('../controllers/OrganizacaoController');
const authMiddleware = require('../middleware/authMiddleware'); // Para autenticação

// Rota para criar uma nova organização/subgrupo (US1.2)
router.post('/', authMiddleware.verifyToken, OrganizacaoController.criarOrganizacao);

module.exports = router;