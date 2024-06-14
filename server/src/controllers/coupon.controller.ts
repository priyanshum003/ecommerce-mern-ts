import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import Coupon from "../models/coupon.model";

// Apply Coupon
export const applyCoupon = asyncHandler(async (req, res, next) => {

    const { code } = req.body;

    if (!code) {
        return next(new ApiError(400, 'Please provide coupon code'));
    }

    const couponCode = await Coupon.findOne({ code });

    if (!couponCode) {
        return next(new ApiError(404, 'Invalid coupon code'));
    }

    return res.status(200).json({
        success: true,
        coupon: couponCode,
        message: 'Coupon applied successfully'
    });
});

// Create New Coupon
export const newCoupon = asyncHandler(async (req, res, next) => {

    const { code, amount } = req.body;

    if (!code || !amount) {
        return next(new ApiError(400, 'Please fill all fields'));
    }

    const couponCode = await Coupon.create({
        code: code.toUpperCase(),
        amount,
    });

    return res.status(201).json({
        success: true,
        message: 'Coupon created successfully',
    });

});

// Delete Coupon
export const deleteCoupon = asyncHandler(async (req, res, next) => {

    const couponId = req.params.id;

    const coupon = await Coupon.findByIdAndDelete(couponId);

    if (!coupon) {
        return next(new ApiError(404, 'Coupon not found'));
    }

    return res.status(200).json({
        success: true,
        message: 'Coupon deleted successfully'
    });
});

// getAllCoupons
export const getAllCoupons = asyncHandler(async (req, res, next) => {

    const coupons = await Coupon.find().sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        coupons
    });
});

