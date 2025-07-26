// __setupDatabase.js
// Este script serve para criar ou recriar todas as tabelas do banco de dados
// com base nos models do Sequelize. Execute-o uma vez pelo terminal.

// Importa a instância do sequelize que já está conectada ao banco de dados
const { sequelize } = require('./src/models');

// Função principal assíncrona para executar a sincronização
async function setupDatabase() {
  console.log('Iniciando a criação de todas as tabelas...');
  console.log('Isso pode apagar dados existentes se as tabelas já existirem. Cuidado!');

  try {
    // O comando mágico: sequelize.sync()
    // Ele lê todos os models que nosso 'index.js' carregou e cria as tabelas.
    // A opção { force: true } APAGA as tabelas existentes antes de criá-las.
    // Ótimo para desenvolvimento, mas NUNCA use em produção com dados reais.
    await sequelize.sync({ force: true });

    console.log('✅ Sucesso! Todas as tabelas foram criadas no banco de dados "qrdobem_db".');
    console.log('Você já pode iniciar o servidor com "npm run dev".');

  } catch (error) {
    // Em caso de erro, exibe a mensagem para facilitar a depuração.
    console.error('❌ Erro ao criar as tabelas:', error);
  } finally {
    // Fecha a conexão com o banco de dados para que o script possa terminar.
    await sequelize.close();
    console.log('Conexão com o banco de dados fechada.');
  }
}

// Executa a função
setupDatabase();
