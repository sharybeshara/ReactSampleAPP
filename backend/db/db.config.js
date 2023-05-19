const { Sequelize, Model, DataTypes } = require("sequelize");

const connect = () => {

    const hostName = "127.0.0.1";
    const userName = "postgres";
    const password = "IamShary123";
    const database = "postgres";
    const dialect = "postgres";

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
    db.kids = require("../model/kid.model")(sequelize, DataTypes, Model);

    return db;

}

module.exports = {
    connect
}