/**
 * Middleware de tratamento de erros centralizado.
 * Captura todos os erros que ocorrem na aplicação.
 */
const errorHandlerMiddleware = (error, req, res, next) => {
  // Log do erro no console para o desenvolvedor ver os detalhes
  console.error('🔥 OCORREU UM ERRO:', error);

  // Lógica para enviar uma resposta de erro padronizada para o cliente
  const status = error.statusCode || 500;
  const message = error.message || 'Ocorreu um erro interno no servidor.';

  // Em ambiente de produção, não queremos vazar detalhes do erro
  // Em desenvolvimento, é útil ter o stack trace
  const response = {
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  res.status(status).json(response);
};

module.exports = errorHandlerMiddleware;