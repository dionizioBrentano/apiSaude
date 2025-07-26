const { models } = require('../models');
const Animal = models.Animal;

class AnimalController {
    /**
     * Cadastra um novo animal. (Já implementado)
     */
    static async criar(req, res) {
        const tutorId = req.user.id;
        const { nome, apelido, especie, raca, sexo, dataNascimento, cor } = req.body;

        if (!nome || !apelido || !especie || !sexo || !dataNascimento) {
            return res.status(400).json({ message: 'Os campos nome, apelido, especie, sexo e dataNascimento são obrigatórios.' });
        }

        try {
            const novoAnimal = await Animal.create({
                nome, apelido, especie, raca, sexo, dataNascimento, cor,
                tutorId: tutorId
            });
            return res.status(201).json(novoAnimal);
        } catch (error) {
            // A chamada para next(error) passará o erro para o nosso errorHandlerMiddleware
            next(error);
        }
    }

    /**
     * Lista todos os animais. (NOVO MÉTODO)
     */
    static async listarTodos(req, res, next) {
        try {
            const animais = await Animal.findAll();
            return res.status(200).json(animais);
        } catch (error) {
            next(error); // Passa o erro para o handler centralizado
        }
    }

    /**
     * Busca um animal específico pelo ID. (NOVO MÉTODO)
     */
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
}

module.exports = AnimalController;