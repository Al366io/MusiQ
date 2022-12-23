// npm i pg sequelize
const Sequelize = require('sequelize');
sequelize = new Sequelize(
  'postgres://alessionannipieri:pass@localhost:5432/musiqtestdb'
);

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Connection to db ok');
  } catch (error) {
    console.log('err' + error);
  }
} start();
module.exports = sequelize;