
const Users = require('./user_model');
module.exports = (sequelize, DataTypes, Model) => {

    class Actions extends Model {}

    Actions.init({
        // Model attributes are defined here
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          user_id: {
            type: DataTypes.INTEGER,
            foreignKey: true,
            allowNull: false
          },
          action_type: {
            type: DataTypes.STRING,
            allowNull: false
          },
          points: {
            type: DataTypes.INTEGER,
            allowNull: false
          }
        
      }, {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'actions', // We need to choose the model name
        timestamps: false
      });

      return Actions;
}