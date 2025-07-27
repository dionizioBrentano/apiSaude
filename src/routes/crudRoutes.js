const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');
const EntityController = require('../controllers/EntityController'); // Importa no topo
const { getModel } = require('../utils/entityMapper');

const methodMap = {
  'POST': 'create',
  'GET_ALL': 'findAll',
  'GET_ONE': 'findById',
  'PUT': 'update',
  'DELETE': 'delete'
};

const dispatch = (methodKey) => {
    return (req, res, next) => {
        const { entidadeTipo } = req.params;
        const Model = getModel(entidadeTipo);

        if (!Model) {
            return res.status(404).json({ message: `Recurso '${entidadeTipo}' não encontrado.` });
        }

        const methodName = methodMap[methodKey];
        const handler = EntityController[methodName];

        // --- INÍCIO DO CÓDIGO DE DEPURAÇÃO ---
        console.log('--- INÍCIO DO DEBUG ---');
        console.log('Tipo de Entidade Recebida:', entidadeTipo);
        console.log('Controller Importado:', EntityController);
        console.log('Nome do Método Procurado:', methodName);
        console.log('Handler Encontrado (Controller[methodName]):', handler);
        console.log('O Handler é uma função?', typeof handler === 'function');
        console.log('--- FIM DO DEBUG ---');
        // --- FIM DO CÓDIGO DE DEPURAÇÃO ---

        if (typeof handler === 'function') {
            return handler(req, res, next);
        } else {
            return res.status(501).json({ message: `Operação '${methodKey}' não implementada.` });
        }
    };
};

// Rotas
router.post('/:entidadeTipo', AuthMiddleware, dispatch('POST'));
// ... (outras rotas)

module.exports = router;