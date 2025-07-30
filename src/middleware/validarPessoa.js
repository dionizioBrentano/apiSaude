// src/middleware/validarPessoa.js
// Importa a função validarCPF do módulo de utilidades
const { validarCPF } = require('../utils/cpfValidator');

function validarPessoa(req, res, next) {
  console.log('--- [VALIDAR PESSOA MIDDLEWARE] INICIANDO VALIDAÇÃO ---');
  console.log('Dados recebidos no BODY:', req.body);
  try {
    // Note: 'nomeCompleto' e 'telefoneCelular' são nomes dos campos no body e modelo.
    // O 'cpf' no body da requisição é o CPF em string.
    const { nomeCompleto, email, telefoneCelular, cpf } = req.body;

    // Validação de Email
    console.log('[VALIDAR PESSOA MIDDLEWARE] Verificando email...');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.error('[VALIDAR PESSOA MIDDLEWARE] ERRO: Email inválido - Validação do Middleware.', { email });
      return res.status(400).json({ error: 'Email inválido.' });
    } else {
      console.log('[VALIDAR PESSOA MIDDLEWARE] Email OK.');
    }

    // Validação de Telefone Celular
    console.log('[VALIDAR PESSOA MIDDLEWARE] Verificando telefoneCelular...');
    // Remove tudo exceto dígitos e o '+' do telefone antes de validar.
    const cleanedPhone = telefoneCelular ? telefoneCelular.replace(/[^\d+]/g, '') : '';
    
    // Regex: Opcional '+' no início, seguido por 10 a 14 dígitos (padrão internacional de 7 a 15 dígitos sem +)
    if (!telefoneCelular || !/^(\+\d{1,3})?\d{10,14}$/.test(cleanedPhone)) {
      console.error('[VALIDAR PESSOA MIDDLEWARE] ERRO: Telefone celular inválido - Validação do Middleware.', { telefoneCelular, cleanedPhone });
      return res.status(400).json({ error: 'Telefone inválido. Formato esperado: +DDDNDigitos ou DDDNDigitos (apenas números após o + opcional).' });
    } else {
      console.log('[VALIDAR PESSOA MIDDLEWARE] Telefone celular OK.');
    }

    // Validação de CPF (se presente no body)
    // Agora usando a função importada de src/utils/cpfValidator.js
    console.log('[VALIDAR PESSOA MIDDLEWARE] Verificando CPF...');
    if (cpf && !validarCPF(cpf)) { // Chama a função validarCPF importada
      console.error('[VALIDAR PESSOA MIDDLEWARE] ERRO: CPF inválido - Validação do Middleware.', { cpf });
      return res.status(400).json({ error: 'CPF inválido.' });
    } else {
      console.log('[VALIDAR PESSOA MIDDLEWARE] CPF OK (se fornecido).');
    }
    
    console.log('--- [VALIDAR PESSOA MIDDLEWARE] VALIDAÇÃO CONCLUÍDA. CHAMANDO NEXT() ---');
    next(); // Continua para o próximo middleware ou controller
  } catch (error) {
    console.error('------- [VALIDAR PESSOA MIDDLEWARE] ERRO INESPERADO (CATCH) -------');
    console.error('Tipo de Erro:', error.name);
    console.error('Mensagem de Erro:', error.message);
    console.error('Stack Trace:', error.stack);
    console.error('----------------------------------------------------');
    return res.status(500).json({ error: 'Erro interno do servidor no middleware de validação.' });
  }
}

module.exports = validarPessoa;