const Sequelize = require('sequelize');

const connection = new Sequelize('guiaperguntas', 'root', 'adminroot', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;