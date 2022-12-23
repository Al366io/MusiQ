const { DataTypes } = require('sequelize');
const sequelize = require('./index.js')

const AuthTable = sequelize.define('AuthTable', {
  user_email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  access_token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  refresh_token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  partyId: {
    type: DataTypes.STRING,
    allowNull: true
  }
})

async function synchronize() {
  await AuthTable.sync();
} synchronize();

module.exports = AuthTable;