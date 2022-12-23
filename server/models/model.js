const { DataTypes } = require('sequelize');
const sequelize = require('./index.js')

const AuthTable = sequelize.define('AuthTable', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

async function synchronize() {
  await AuthTable.sync();
} synchronize();

module.exports = AuthTable;