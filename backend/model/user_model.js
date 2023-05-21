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
        email: {
          type: DataTypes.STRING,
        },
        user_role: {
          type: DataTypes.STRING,
        },
        total_points: {
            type: DataTypes.INTEGER,
        }
      }, {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'users', // We need to choose the model name
        timestamps: false
      });
      
      return Users;
}