const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mi_backend_db', 'root', 'NuevaContraseña123!', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;






