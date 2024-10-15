import express from "express";
import { ActiveCoupon, UsedCoupon, BuyOrder } from "../models/index.js";
import authenticateToken from "../middleware/auth.middleware.js";
import { getActiveCoupon } from "./coupons.js";
import { createCoupon } from "../utils/coupons.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const orders = await BuyOrder.findAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error });
  }
});

const applyCoupon = async (order, coupon) => {
  const { code, discount, userId } = coupon;

  await UsedCoupon.create({
    code: code,
    discount: discount,
    userId: userId,
    updateDate: new Date(),
    active: false,
  });
  await ActiveCoupon.destroy({
    where: {
      code: code,
    },
  });
  const newOrder = {
    ...order,
    discountCode: code,
    discount: discount,
    price: order.price - (order.price * discount) / 100,
  };
  return newOrder;
};

const canCreateCoupon = async (userId) => {
  const { ACTIVE_COUPONS_LIMIT, COUPONS_PER_USER_LIMIT } = process.env;
  try {
    const activeCouponsCount = await ActiveCoupon.count();
    if (activeCouponsCount <= ACTIVE_COUPONS_LIMIT) {
      const userCouponsCount = await ActiveCoupon.count({
        where: { userId: userId },
      });
      if (userCouponsCount < COUPONS_PER_USER_LIMIT) return true;
      return false;
    }
    return false;
  } catch (error) {
    return false;
  }
};

router.post("/", authenticateToken, async (req, res) => {
  const { price, discountCode } = req.body;

  if (!price) return res.status(500).json({ error: "order info is missing" });

  let order = {
    price: price,
    discountCode: discountCode,
    discount: null,
    total: price,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    if (order.discountCode) {
      const coupon = await getActiveCoupon(order.discountCode);
      if (coupon) order = await applyCoupon(order, coupon);
    }

    const canCreate = await canCreateCoupon(req.user.userId);
    const response = {
      orders: await BuyOrder.create(order),
      coupon: canCreate
        ? await ActiveCoupon.create({
            ...createCoupon(),
            userId: req.user.userId,
          })
        : null,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default router;
