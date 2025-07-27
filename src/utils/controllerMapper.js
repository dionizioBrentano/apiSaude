// Importa todos os nossos controllers especialistas
const PessoaController = require('../controllers/PessoaController');
const AnimalController = require('../controllers/AnimalController');
// Futuramente: const ObjetoController = require('../controllers/ObjetoController');

// Este objeto é o nosso "registro". Ele mapeia a string da URL para a Classe do Controller.
const controllerMap = {
  pessoas: PessoaController,
  animais: AnimalController,
  // objetos: ObjetoController,
};

// Função que busca o controller no registro
const getController = (entityName) => {
  const Controller = controllerMap[entityName];
  if (!Controller) {
    // Retorna null se a entidade não for encontrada, para a rota tratar como 404
    return null;
  }
  return Controller;
};

module.exports = { getController };