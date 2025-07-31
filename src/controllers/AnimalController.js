const { Animal } = require('../models');

const AnimalController = {
  // Cria um novo animal
  async criar(req, res) {
    try {
      const animal = await Animal.create(req.body);
      return res.status(201).json(animal);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  // Atualiza um animal existente
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const [updated] = await Animal.update(req.body, { where: { id } });
      if (updated) {
        const animal = await Animal.findByPk(id);
        return res.json(animal);
      }
      return res.status(404).json({ error: 'Animal não encontrado' });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  // Lista todos os animais
  async listarTodos(req, res) {
    try {
      const animais = await Animal.findAll();
      return res.json(animais);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  // Busca animal por ID
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const animal = await Animal.findByPk(id);
      if (animal) {
        return res.json(animal);
      }
      return res.status(404).json({ error: 'Animal não encontrado' });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
};

module.exports = AnimalController;