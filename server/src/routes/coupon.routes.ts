import express from 'express';
import {
    applyCoupon,
    deleteCoupon,
    getAllCoupons,
    newCoupon
} from '../controllers/coupon.controller';
import { adminOnly, authenticateUser } from '../middleware/auth.middleware';

const router = express.Router();

// Admin-only routes
router.post('/new', authenticateUser, adminOnly, newCoupon);
router.delete('/delete/:id', authenticateUser, adminOnly, deleteCoupon);
router.get('/all', authenticateUser, adminOnly, getAllCoupons);

// Authenticated user route
router.post('/apply', authenticateUser, applyCoupon);

export default router;