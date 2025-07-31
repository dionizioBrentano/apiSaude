'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db = {};

// AJUSTE CRÍTICO: Carrega o arquivo config.js que agora tem as configurações por ambiente
// O caminho é '../config/config.js' porque index.js está em src/models
const allConfigs = require(path.join(__dirname, '../config/config.js'));
const sequelizeConfig = allConfigs[env]; // Seleciona a configuração para o ambiente atual

// Cria a instância do Sequelize usando a configuração do ambiente
const sequelize = new Sequelize(
    sequelizeConfig.database,
    sequelizeConfig.username,
    sequelizeConfig.password,
    sequelizeConfig // Passa o objeto de configuração completo
);

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js' &&
            file.indexOf('.test.js') === -1
        );
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;