import express from 'express';
import { getStats } from '../controllers/stats.controller';
import { adminOnly, authenticateUser } from '../middleware/auth.middleware';

const router = express.Router();

// Define the route for fetching stats
router.get('/', authenticateUser, adminOnly, getStats);

export default router;
