const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes, Model) => {

  class Users extends Model {}

  Users.init({
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mobile_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_role: {
      type: DataTypes.STRING,
    },
    payment_method:{
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(value, salt);
        this.setDataValue('password', hash);
      }
    }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'users', // We need to choose the model name
    timestamps: false
  });

  return Users;
}