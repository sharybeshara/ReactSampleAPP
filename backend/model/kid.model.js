module.exports = (sequelize, DataTypes, Model) => {

    class Kids extends Model {}

    Kids.init({
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
        total_points: {
            type: DataTypes.INTEGER,
        }
      }, {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'kids', // We need to choose the model name
        timestamps: false
      });
      
      return Kids;
}