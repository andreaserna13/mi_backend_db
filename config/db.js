const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('mi_backend_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize;






