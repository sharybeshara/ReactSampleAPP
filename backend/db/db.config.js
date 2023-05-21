const { Sequelize, Model, DataTypes } = require("sequelize");
require('dotenv').config();
const connect = () => {

    const hostName = process.env.REACT_APP_HOST;
    const userName = process.env.REACT_APP_USER;
    const password = process.env.REACT_APP_PASSWORD;
    const database = process.env.REACT_APP_DATABASE;
    const dialect = process.env.REACT_APP_DIALECT;

    const sequelize = new Sequelize(database, userName, password, {
        host: hostName,
        dialect: dialect,
        operatorsAliases: false,
        pool: {
            max: 10,
            min: 0,
            acquire: 20000,
            idle: 5000
        }
    });

    const db = {};
    db.Sequelize = Sequelize;
    db.sequelize = sequelize;
    db.users = require("../model/user_model")(sequelize, DataTypes, Model);

    return db;

}

module.exports = {
    connect
}