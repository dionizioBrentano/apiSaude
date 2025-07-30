const express = require('express');
const router = express.Router();
const PessoaController = require('../controllers/PessoaController');
const authMiddleware = require('../middleware/authMiddleware'); // Certifique-se de que este middleware exista

// Rota para cadastrar uma nova pessoa (US1.1 e US2.1)
// Assume que PessoaController.cadastrar lida com a lógica de standbyToken ou que o middleware já o validou
router.post('/', PessoaController.cadastrar); 

// Rota para atualizar o CPF de uma pessoa (US2.3)
// Requer autenticação com um token de login válido (usuário ATIVO_BASICO, por exemplo)
router.patch('/cpf', authMiddleware.verifyToken, PessoaController.atualizarCpf);

// Exemplo: Rota para obter detalhes de uma pessoa (se você tiver)
// router.get('/:id', authMiddleware.verifyToken, PessoaController.getPessoaById);

module.exports = router;