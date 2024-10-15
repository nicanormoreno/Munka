import express from 'express'
import { ActiveCoupon, UsedCoupon } from '../models/index.js';

const router = express.Router();

router.get('/all', async (req, res) => {
    try{
        const coupons = await Promise.all( [await ActiveCoupon.findAll(), await UsedCoupon.findAll()])
        res.json(coupons);
    }catch(error){
        res.status(404).json({error})
    }
})

const getActiveCoupon= (code) => {
    return  ActiveCoupon.findOne({
        where: {
            code: code
        }
    })
}

const getUsedCoupon = async (code) => {
    return await UsedCoupon.findOne({
        where: {
            code: code
        }
    })
}

router.get('/:code/validate', async(req,res)=>{
    const {code} = req.params
    if(!code)
        return res.status(400).json({error: 'code required'})
    try{
        const validCoupon = await getActiveCoupon(code)
        if (validCoupon) return res.json(validCoupon)

        const invalidCoupon = await getUsedCoupon(code)
        if (invalidCoupon) return res.json(invalidCoupon)

        return res.status(404).json({ error: 'Coupon not found' });
    }catch(error) {
        res.status(500).json({error})
    }
})

router.get('/', async(req,res)=>{
    try {
        const coupons = await ActiveCoupon.findAll({
            where: {userId: req.user.userId}
        })
        res.json(coupons)
    } catch(error) {
        res.status(500).json({error})
    }
})

export default router

export {
    getActiveCoupon
}