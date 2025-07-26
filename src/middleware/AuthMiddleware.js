const jwt = require('jsonwebtoken');

const AuthMiddleware = (req, res, next) => {
  // Pega o cabeçalho 'authorization' da requisição
  const { authorization } = req.headers;

  // 1. Verifica se o token foi enviado
  if (!authorization) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  // 2. O formato do token é "Bearer [token]". Vamos separar as duas partes.
  const parts = authorization.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Erro no token. Formato esperado: "Bearer [token]".' });
  }
  const token = parts[1];

  // 3. Verifica se o token é válido
  try {
    // jwt.verify decodifica o token. Se for inválido (expirado, assinatura errada), ele gera um erro.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Anexamos o payload do token (que contém id e nome do usuário) ao objeto 'req'.
    // Assim, a próxima função (o controller) terá acesso ao usuário logado.
    req.user = decoded;

    return next(); // Se tudo estiver OK, permite que a requisição continue para o controller.
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};

module.exports = AuthMiddleware;