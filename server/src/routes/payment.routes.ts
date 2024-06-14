import express from 'express';
import { createPaymentIntent } from '../controllers/payment.controller';
import { authenticateUser } from '../middleware/auth.middleware';

const router = express.Router();

// Authenticated user routes
router.post('/new', authenticateUser, createPaymentIntent);

export default router;