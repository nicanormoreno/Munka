
import {ActiveCoupon, UsedCoupon, User, BuyOrder} from '../models/index.js'
import {createCoupon} from '../utils/coupons.js'

const seed = async function() {
    await UsedCoupon.sync()
    await ActiveCoupon.sync()
    await User.sync()
    await BuyOrder.sync()

    const users = [{
        name: "John",
        lastName: "Doe",
        mail: "john.doe@mail.com",
        password: "Pass123"
    },
{
    name: "Chris",
    lastName: "Test",
    mail: "chris.test@mail.com",
    password: "123Pass"
}]
    const coupon = createCoupon()
    await Promise.all([...users.map(async(user) => await User.create(user))])
    // await User.create(user)
    await ActiveCoupon.create({
       ...coupon,
        userId: 1
    });

    console.log('Done')
}

export { seed }