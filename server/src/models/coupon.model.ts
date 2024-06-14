import mongoose from "mongoose";

export const CouponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "Please enter coupon code"],
        unique: true,
    },
    amount: {
        type: Number,
        required: [true, "Please enter discount amount"],
    },
}, { timestamps: true });

export default mongoose.model("Coupon", CouponSchema);