// api/src/middleware/authMiddleware.js
// Exemplo básico de middleware de autenticação JWT

const jwt = require('jsonwebtoken');
// const { Pessoa } = require('../models'); // Se você precisar buscar a pessoa no DB para validar

class AuthMiddleware {
    static async verifyToken(req, res, next) {
        // Obter o token do cabeçalho de autorização
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
        }

        const token = authHeader.split(' ')[1]; // Espera "Bearer TOKEN_AQUI"

        if (!token) {
            return res.status(401).json({ message: 'Formato do token inválido.' });
        }

        try {
            // Verificar e decodificar o token
            // TODO: Use seu JWT_SECRET real do .env
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key'); 
            
            // Opcional: Buscar o usuário no banco de dados para garantir que ele ainda existe e está ativo
            // const user = await Pessoa.findByPk(decoded.id);
            // if (!user || user.statusConta !== 'ATIVO_BASICO') { // Ou o status que permite a atualização
            //     return res.status(403).json({ message: 'Usuário não autorizado ou conta inativa.' });
            // }

            // Anexar as informações do usuário à requisição para uso posterior
            req.user = decoded; // Ou req.user = user; se você buscar do banco de dados
            next(); // Prossegue para a próxima função no pipeline (o controlador)

        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token de autenticação expirado.' });
            }
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Token de autenticação inválido.' });
            }
            console.error('Erro na verificação do token:', error);
            res.status(500).json({ message: 'Falha na autenticação do token.', error: error.message });
        }
    }
}

module.exports = AuthMiddleware;