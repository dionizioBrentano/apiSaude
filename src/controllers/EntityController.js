const { getModel } = require('../utils/entityMapper');
const { models, sequelize } = require('../models');
const { Pessoa, Evento } = models;
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

class EntityController {
    static async create(req, res, next) {
        const t = await sequelize.transaction();
        const { entidadeTipo } = req.params;
        const dados = req.body;
        
        try {
            if (entidadeTipo === 'pessoas') {
                const { email, telefoneCelular } = dados;
                if (!email || !telefoneCelular) {
                    await t.rollback();
                    return res.status(400).json({ message: 'Email e Telefone Celular são obrigatórios.' });
                }
                const existingPessoa = await Pessoa.findOne({
                    where: {
                        [Op.or]: [{ email: email }, { telefoneCelular: telefoneCelular }]
                    },
                    transaction: t
                });
                if (existingPessoa) {
                    await t.rollback();
                    const field = existingPessoa.email === email ? 'e-mail' : 'telefone celular';
                    return res.status(409).json({ message: `Este ${field} já está cadastrado.` });
                }
            }

            const Model = getModel(entidadeTipo);
            let usuarioId;

            if (entidadeTipo === 'pessoas') {
                if (!req.isStandby) {
                    await t.rollback();
                    return res.status(403).json({ message: 'Acesso negado. Utilize um token de cadastro para esta operação.' });
                }
                usuarioId = null; 
            } else {
                if (!req.user || !req.user.id) {
                    await t.rollback();
                    return res.status(403).json({ message: 'Acesso negado. Apenas usuários logados podem realizar esta operação.' });
                }
                usuarioId = req.user.id;
                if (entidadeTipo === 'animais') {
                    dados.tutorId = usuarioId;
                }
            }
            
            const novaEntidade = await Model.create(dados, { transaction: t });

            if (entidadeTipo === 'pessoas' && novaEntidade) {
              usuarioId = novaEntidade.id;
            }

            await Evento.create({
                entidadeId: novaEntidade.id,
                tipoEvento: 'ENTIDADE_CRIADA',
                dadosEvento: { tipo: entidadeTipo, dados: novaEntidade.toJSON() },
                executadoPorUsuarioId: usuarioId
            }, { transaction: t });

            let token = null;
            if (entidadeTipo === 'pessoas') {
                const payload = { id: novaEntidade.id, nome: novaEntidade.nomeCompleto, status: novaEntidade.statusConta };
                token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
            }
            
            await t.commit();
            
            const resposta = novaEntidade.toJSON();
            delete resposta.senha;

            if (token) {
                return res.status(201).json({ user: resposta, token: token });
            }
            return res.status(201).json(novaEntidade);

        } catch (error) {
            await t.rollback();
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
            }
            if (error.message.includes('não reconhecida')) {
                return res.status(404).json({ message: error.message });
            }
            next(error);
        }
    }
    // ... outros métodos ...
}
module.exports = EntityController;