import { Request, Response, Router } from 'express';
import { getAllUsers, getMe, getUser, login, logoutUser, signup } from '../controllers/auth.controller';
import { adminOnly, authenticateUser } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/login', login);
router.post('/logout', logoutUser); // Assuming logout might not require authentication
router.post('/signup', signup);

// Authenticated user routes
router.get('/me', authenticateUser, getMe);

// Admin-only routes
router.get('/all', authenticateUser, adminOnly, getAllUsers);
router.get('/:id', authenticateUser, adminOnly, getUser);

export default router;