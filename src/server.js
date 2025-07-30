require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./models'); // Importa a conexão com o banco e todos os modelos
const validarPessoa = require('./middleware/validarPessoa'); // Middleware de validação

const PessoaController = require('./controllers/PessoaController');

const app = express();

// Middleware para JSON
app.use(express.json());

// Middleware para arquivos estáticos
app.use(express.static(path.join(__dirname, '../../public')));

// Rota de cadastro de pessoas (US2.1 + US1.1)
app.post('/api/v1/pessoas', validarPessoa, PessoaController.cadastrarPessoa);

// Rota de validação de conta (US2.2)
app.get('/api/v1/validar-conta', PessoaController.validarConta);

// --- NOVA ROTA PARA ATUALIZAR CPF (US2.3) ---
// Note: Essa rota por enquanto não tem autenticação, mas terá no futuro.
// O middleware validarPessoa pode ser usado para validar o formato do CPF antes de chegar no controller.
app.patch('/api/v1/pessoas/cpf', validarPessoa, PessoaController.atualizarCpf);


// Inicialização do servidor (sem sync)
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});