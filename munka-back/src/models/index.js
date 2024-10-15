import activeCoupons from './activeCoupons.js'
import usedCoupons from './usedCoupons.js'
import buyOrders from './buyOrder.js'
import users from './users.js'
import sequelize from '../config/db.js'

const ActiveCoupon = activeCoupons(sequelize)
const UsedCoupon= usedCoupons(sequelize)
const BuyOrder = buyOrders(sequelize)
const User = users(sequelize)

User.hasMany(ActiveCoupon, {foreignKey: 'userId'})
User.hasMany(UsedCoupon, {foreignKey: 'userId'})
User.hasMany(BuyOrder, {foreignKey: 'userId'})

ActiveCoupon.belongsTo(User, {foreignKey: 'userId'})
UsedCoupon.belongsTo(User, {foreignKey: 'userId'})
BuyOrder.belongsTo(User, {foreignKey: 'userId'})

BuyOrder.belongsTo(UsedCoupon, { foreignKey: 'discountCode', targetKey: 'code' });
UsedCoupon.hasOne(BuyOrder, { foreignKey: 'discountCode', sourceKey: 'code' });

export {
    ActiveCoupon,
    UsedCoupon,
    BuyOrder,
    User
}
