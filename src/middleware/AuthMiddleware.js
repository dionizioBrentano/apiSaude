const jwt = require('jsonwebtoken');

const AuthMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  const [, token] = authorization.split(' ');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificamos o conteúdo (payload) do token
    if (decoded.type === 'STANDBY') {
      // Se for um token de standby, marcamos a requisição e continuamos
      req.isStandby = true;
    } else if (decoded.id) {
      // Se for um token de usuário normal, anexamos os dados do usuário
      req.user = decoded;
    } else {
      // Se for um token com formato desconhecido
      return res.status(401).json({ message: 'Token em formato desconhecido.' });
    }
    
    return next(); // Permite que a requisição continue

  } catch (error) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};

module.exports = AuthMiddleware;