import { DataTypes } from "sequelize"
/**
 @param sequelize
 @returns {BuyOrderClass} 
*/

const buyOrder = function(sequelize) {
    const model = sequelize.define(
    'BuyOrder',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            initialAutoIncrement: 1,
            primaryKey: true,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        discount: {
            type: DataTypes.DECIMAL(5, 2), 
            allowNull: true,
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
          }
    },
    {
        timestamps: true,
        tableName: 'buy_orders'
    })

    return model;
}

export default buyOrder