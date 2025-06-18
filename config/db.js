const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('railway', 'root', 'jeSjgAAWuTwcbIeupnakGqncuREfWIeg', {
  host: 'interchange.proxy.rlwy.net',
  port: 53388,
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

module.exports = sequelize;







