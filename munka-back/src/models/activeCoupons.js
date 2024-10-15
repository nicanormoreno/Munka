import { DataTypes } from "sequelize"

/**
 @param sequelize
 @returns {ActiveCouponClass} 
*/
const ActiveCoupon = function( sequelize ) {
  const model = sequelize.define(
      'ActiveCoupon',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          initialAutoIncrement: 1,
          primaryKey: true,
        },
        code: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          index:true, 
        },
        discount:{
          type: DataTypes.INTEGER(5,2),
          allowNull: false,
          validate:{
            max: 100,
            min: 0
          }
        },
        active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        buyOrderId: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        timestamps: true,
        tableName: 'active_coupons'
      }
  );

  return model
};

export default ActiveCoupon
