import { NextFunction, Request, Response } from 'express';
import admin from 'firebase-admin';
import User from '../models/user.model';
import { User as UserInterface } from '../types/types';


interface RequestWithUser extends Request {
    user?: UserInterface;
}

export const authenticateUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    console.log(req.cookies.token)
    const idToken = req.cookies.token; // Read token from cookies
    if (!idToken) {
        return res.status(401).json({ message: 'No token provided' });
    }
    
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid } = decodedToken;

        const user = await User.findOne({ uid });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export const adminOnly = (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized , Admin Only Route' });
    }

    next();
}