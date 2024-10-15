import {v4} from 'uuid'
const createCoupon = () => {
    const discount=[10,20,25,30]
    const coupon = {
        code: codeGenerator(),
        discount: discount[Math.floor(Math.random() * discount.length)],
        userId: null,
        active: true,
        createAt: new Date(),
        updatedAt: new Date(),
    }
    return  coupon
}

const codeGenerator= () => {
    const uuid = v4();
    return uuid.replace(/-/g, '').slice(0,16)
}

export {
    createCoupon
}