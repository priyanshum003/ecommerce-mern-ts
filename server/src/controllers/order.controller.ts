import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import Order from "../models/order.model";
import { NewOrderRequestBody, RequestWithUser } from "../types/types";
import { ApiError } from "../utils/ApiError";
import { reduceStock } from "../utils/utils";

// Create New Order
export const newOrder = asyncHandler(async (req: Request<{}, {}, NewOrderRequestBody>, res: Response, next: NextFunction) => {

    const { orderItems, shippingInfo, discount, shippingCharges, subTotal, tax, total } = req.body;

    if (!shippingCharges || !shippingInfo || !subTotal || !tax || !total) {
        return next(new ApiError(400, 'Please fill all fields'));
    }

    const user = (req as RequestWithUser).user;

    const order = new Order({
        orderItems,
        shippingInfo,
        discount,
        shippingCharges,
        subTotal,
        tax,
        total,
        user: user._id
    });

    // reduce stock
    reduceStock(orderItems);

    const newOrder = await order.save();

    return res.status(201).json({
        success: true,
        message: 'Order placed successfully',
    })
})

// Update order status
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
    const { orderId, status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    order.status = status;
    await order.save();

    res.status(200).json({ success: true, message: 'Order status updated successfully' });
});

// Delete Order
export const deleteOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) return next(new ApiError(404, 'Order not found'));

    await order.deleteOne();

    return res.status(200).json({
        success: true,
        message: 'Order deleted successfully'
    });
});

// Get User Orders
export const getUserOrders = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as RequestWithUser).user;

    const orders = await Order.find({ user: user._id });

    return res.status(200).json({
        success: true,
        orders
    });
});

// Get All Orders
export const getAllOrders = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const orders = await Order.find().populate('user', 'name email');

    return res.status(200).json({
        success: true,
        orders
    });
});

// Get Single Order
export const getOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;

    const order = await Order.findById(orderId).populate('user', 'name email');

    if (!order) return next(new ApiError(404, 'Order not found'));

    return res.status(200).json({
        success: true,
        order
    });
});