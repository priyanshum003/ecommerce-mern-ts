import stripe from "../config/stripe.config";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";


export const createPaymentIntent = asyncHandler(async (req, res, next) => {

    const { amount } = req.body;

    if (!amount) {
        return next(new ApiError(400, 'Please provide amount'));
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'inr',
    });

    return res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret,
        message: 'Payment Intent created successfully'
    });
});


