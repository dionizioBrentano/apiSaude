// api/test_db_connection.js

require('dotenv').config(); // Garante que as variáveis do .env sejam carregadas

console.log('--- Teste de Conexão Direta ao Banco de Dados ---');

// Exibe as variáveis de ambiente que serão usadas para conexão (mascarando a senha)
console.log(`DB_USERNAME: ${process.env.DB_USERNAME}`);
console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD ? '****** (presente)' : '(AUSENTE)'}`);
console.log(`DB_DATABASE: ${process.env.DB_DATABASE}`);
console.log(`DB_HOST: ${process.env.DB_HOST}`);
console.log(`DB_PORT: ${process.env.DB_PORT}`); // Adicionado para incluir a porta
console.log('------------------------------------------------');

// Importa o Sequelize
const { Sequelize } = require('sequelize');

// Tenta criar uma nova instância do Sequelize com as variáveis do .env
const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT, // Usa a porta do .env
        dialect: 'mysql',
        logging: console.log // Para ver os logs de conexão do Sequelize
    }
);

async function testConnection() {
    try {
        console.log('Tentando autenticar conexão com o banco de dados...');
        await sequelize.authenticate();
        console.log('SUCESSO: Conexão com o banco de dados estabelecida com sucesso!');

        // --- INÍCIO DA VERIFICAÇÃO DE TABELAS (MINHA ADIÇÃO) ---
        console.log('\n--- Verificação de Tabelas Esperadas no DB ---');
        const expectedModels = [
            'Pessoa', 
            'Organizacao', 
            'Membro',
            'Animal',
            'Objeto',
            'Documento',
            'Endereco',
            'Imagem',
            'AuditoriaLog',
            'Transacao',
            'EntidadeProtegida'
            // Adicione aqui outros nomes de modelos conforme seus arquivos Model.js (sem o sufixo 'Model')
        ];

        // Carrega os modelos para que o Sequelize saiba quais tabelas procurar
        const db = {};
        const fs = require('fs');
        const path = require('path');
        const modelsPath = path.join(__dirname, 'src', 'models'); // Caminho para a pasta models

        fs.readdirSync(modelsPath)
            .filter(file => {
                return (file.indexOf('.') !== 0 && file !== 'index.js' && file.slice(-3) === '.js');
            })
            .forEach(file => {
                const model = require(path.join(modelsPath, file))(sequelize, Sequelize.DataTypes);
                db[model.name] = model; // Carrega o modelo
            });

        // Itera sobre os nomes esperados das tabelas (baseados nos nomes dos modelos)
        const queryInterface = sequelize.getQueryInterface();
        for (const modelName of expectedModels) {
            // No Sequelize, model.name é 'Pessoa', e o tableName por padrão é 'Pessoas'
            // A menos que você explicitamente defina 'tableName' no modelo,
            // o Sequelize pluraliza o nome do modelo. Ex: 'Pessoa' -> 'Pessoas', 'Organizacao' -> 'Organizacaos'
            // Assumimos que seus modelos têm 'tableName' definido no plural, ou o Sequelize pluraliza.
            const tableName = db[modelName] ? db[modelName].tableName : modelName + 's'; // Tenta pegar o tableName do modelo, senão pluraliza
            
            const exists = await queryInterface.showAllTables()
                                                .then(tables => tables.includes(tableName));
            if (exists) {
                console.log(`✅ Tabela '${tableName}' (Modelo '${modelName}') existe.`);
            } else {
                console.error(`❌ Tabela '${tableName}' (Modelo '${modelName}') NÃO existe.`);
            }
        }
        console.log('--- Fim da Verificação de Tabelas ---\n');
        // --- FIM DA VERIFICAÇÃO DE TABELAS ---

    } catch (error) {
        console.error('FALHA: Não foi possível conectar ao banco de dados ou verificar tabelas.');
        console.error('Detalhes do erro:', error.message);
        console.error('Stack trace completo:', error.stack);
    } finally {
        await sequelize.close(); // Fecha a conexão
        console.log('Conexão fechada.');
    }
}

testConnection();