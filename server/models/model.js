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
  party_id: {
    type: DataTypes.STRING,
    allowNull: true
  }
})

const PartiesTable = sequelize.define('PartiesTable', {
  queue: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  owner_email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  socket_room_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  party_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  private: { // members only or not 
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  upvote_allowed: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  visible: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  duplicate_timeout: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
})

async function synchronize() {
  await AuthTable.sync();
  await PartiesTable.sync();
} synchronize();

module.exports = {AuthTable, PartiesTable};