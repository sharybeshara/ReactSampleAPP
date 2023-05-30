
module.exports = (sequelize, DataTypes, Model) => {

    class Kids extends Model { }

    Kids.init({
        // define kid table columns
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dateofbirth: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        parent_id: {
            type: DataTypes.INTEGER,
            foreignKey: true,
        },
        userid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        total_points: {
            type: DataTypes.INTEGER,
        },
    }, {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'kids', // We need to choose the model name
        timestamps: false
    });

    return Kids;
}