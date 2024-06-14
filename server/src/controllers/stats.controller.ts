// controllers/statsController.ts
import { Request, Response } from 'express';
import Order from '../models/order.model';  // Assuming you have an Order model
import User from '../models/user.model';    // Assuming you have a User model
import { Product } from '../models/product.model'; // Assuming you have a Product model
import Coupon from '../models/coupon.model'; // Assuming you have a Coupon model

export const getStats = async (req: Request, res: Response): Promise<void> => {
    try {
        // Fetch all orders
        const ordersPromise = Order.find().populate('user').exec();

        // Calculate user gender demographics
        const userGenderDemographicPromise = User.aggregate([
            { $group: { _id: '$gender', count: { $sum: 1 } } },
        ]).exec();

        // Fetch total products
        const totalProductsPromise = Product.countDocuments().exec();

        // Fetch total coupons
        const totalCouponsPromise = Coupon.countDocuments().exec();

        const [orders, userGenderDemographic, totalProducts, totalCoupons] = await Promise.all([
            ordersPromise,
            userGenderDemographicPromise,
            totalProductsPromise,
            totalCouponsPromise,
        ]);

        // Calculate total revenue
        const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

        // Calculate revenue by month
        const revenueByMonth = orders.reduce((acc, order) => {
            const month = new Date(order.createdAt).getMonth();
            acc[month] = (acc[month] || 0) + order.total;
            return acc;
        }, {} as Record<number, number>);

        // Calculate revenue by week
        const revenueByWeek = orders.reduce((acc, order) => {
            const week = getWeekOfYear(new Date(order.createdAt));
            acc[week] = (acc[week] || 0) + order.total;
            return acc;
        }, {} as Record<number, number>);

        // Calculate revenue by day
        const revenueByDay = orders.reduce((acc, order) => {
            const day = new Date(order.createdAt).toISOString().split('T')[0];
            acc[day] = (acc[day] || 0) + order.total;
            return acc;
        }, {} as Record<string, number>);

        // Calculate sales by category
        const salesByCategory = orders.reduce((acc, order) => {
            order.orderItems.forEach((item) => {
                const productId = item.productId.toString(); // Convert ObjectId to string
                acc[productId] = (acc[productId] || 0) + item.quantity;
            });
            return acc;
        }, {} as Record<string, number>);

        // Calculate best selling products
        const bestSellingProducts = Object.entries(salesByCategory)
            .map(([productId, quantity]) => ({ productId, quantity }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);

        // Calculate total orders
        const totalOrders = orders.length;

        // Get the latest 5 orders
        const latestOrders = orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5);

        res.json({
            success: true,
            stats: {
                totalRevenue,
                revenueByMonth,
                revenueByWeek,
                revenueByDay,
                salesByCategory,
                bestSellingProducts,
                userGenderDemographic,
                totalOrders,
                latestOrders,
                totalProducts,
                totalCoupons,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Helper function to get the week of the year
const getWeekOfYear = (date: Date): number => {
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = (date.getTime() - start.getTime() + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000)) / 86400000;
    return Math.ceil((diff + ((start.getDay() + 1) - 1)) / 7);
};
