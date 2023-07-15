const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const messageData = sequelize.define('archieve', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      message:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
});
    
module.exports = messageData;