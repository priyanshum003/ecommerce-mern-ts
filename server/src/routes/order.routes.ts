import express from 'express';
import {
    deleteOrder,
    getAllOrders,
    getOrder,
    getUserOrders,
    newOrder,
    updateOrderStatus
} from '../controllers/order.controller';
import { adminOnly, authenticateUser } from '../middleware/auth.middleware';

const router = express.Router();

// Authenticated user routes
router.post('/new', authenticateUser, newOrder);
router.get('/my', authenticateUser, getUserOrders);

// Admin-only routes
router.get('/all', authenticateUser, adminOnly, getAllOrders);
router.delete('/delete/:id', authenticateUser, adminOnly, deleteOrder);
router.get('/:id', authenticateUser, getOrder);
router.put('/:id', authenticateUser, adminOnly, updateOrderStatus);

export default router;