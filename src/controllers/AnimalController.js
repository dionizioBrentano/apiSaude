const { models, sequelize } = require('../models');
// Garante que ambos os models sejam importados corretamente
const { Animal, Evento } = models; 

class AnimalController {
    // ... (todos os seus métodos: criar, listarTodos, buscarPorId, atualizar)
    // Nenhuma alteração na lógica dos métodos é necessária, apenas na importação acima.
    
    static async criar(req, res, next) {
        const t = await sequelize.transaction();
        const tutorId = req.user.id;
        const dadosDoAnimal = req.body;
        try {
            const novoAnimal = await Animal.create({ ...dadosDoAnimal, tutorId: tutorId }, { transaction: t });
            await Evento.create({
                entidadeId: novoAnimal.id,
                tipoEvento: 'ANIMAL_CRIADO',
                dadosEvento: novoAnimal.toJSON(),
                executadoPorUsuarioId: tutorId
            }, { transaction: t });
            await t.commit();
            return res.status(201).json(novoAnimal);
        } catch (error) {
            await t.rollback();
            next(error);
        }
    }

    static async listarTodos(req, res, next) {
        try {
            const animais = await Animal.findAll();
            return res.status(200).json(animais);
        } catch (error) {
            next(error);
        }
    }

    static async buscarPorId(req, res, next) {
        try {
            const { id } = req.params;
            const animal = await Animal.findByPk(id);
            if (!animal) {
                return res.status(404).json({ message: 'Animal não encontrado.' });
            }
            return res.status(200).json(animal);
        } catch (error) {
            next(error);
        }
    }

    static async atualizar(req, res, next) {
        const t = await sequelize.transaction();
        const { id } = req.params;
        const userId = req.user.id;
        const dadosParaAtualizar = req.body;
        try {
            const animal = await Animal.findByPk(id, { transaction: t });
            if (!animal) {
                await t.rollback();
                return res.status(404).json({ message: 'Animal não encontrado.' });
            }
            if (animal.tutorId !== userId) {
                await t.rollback();
                return res.status(403).json({ message: 'Acesso negado. Você não é o tutor deste animal.' });
            }
            await Evento.create({
                entidadeId: animal.id,
                tipoEvento: 'ANIMAL_ATUALIZADO',
                dadosEvento: { de: animal.toJSON(), para: dadosParaAtualizar },
                executadoPorUsuarioId: userId
            }, { transaction: t });
            await animal.update(dadosParaAtualizar, { transaction: t });
            await t.commit();
            return res.status(200).json(animal);
        } catch (error) {
            await t.rollback();
            next(error);
        }
    }
}

module.exports = AnimalController;