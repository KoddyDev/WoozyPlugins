require('dotenv').config();
const { Sequelize } = require("sequelize")

module.exports = new Sequelize("s7_Vini", "u7_TfFSkz8Z6a", "lufCEehBADd+g=5KFlkE^W.^", {
    host: "52.161.101.166",
    dialect: 'mysql'
})