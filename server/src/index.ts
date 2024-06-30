import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express, { Application, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import { cloudinary } from './config/cloudinary.config';

import connectDB from './config/db.config';
import firebaseApp from './config/firebase.config';

import authRoutes from './routes/auth.routes';
import couponRoutes from './routes/coupon.routes';
import orderRoutes from './routes/order.routes';
import paymentRoutes from './routes/payment.routes';
import productRoutes from './routes/product.route';
import statsRoutes from './routes/stats.route';

import { apiErrorMiddleware } from './utils/ApiError';
import winston from 'winston';

firebaseApp.firestore();

const app: Application = express();

const PORT = process.env.PORT || 8000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

connectDB();

// Apply middlewares
app.use(cors({ credentials: true, origin: CLIENT_URL }));
app.use(helmet());
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: ["'self'"],
//             scriptSrc: ["'self'", "https://apis.google.com"],
//             connectSrc: ["'self'", "https://apis.google.com"],
//             frameSrc: ["'self'", "https://accounts.google.com", "https://final-ecommerce-ad41b.firebaseapp.com"], // Add Firebase domain
//             imgSrc: ["'self'", "https://www.gstatic.com", "https://*.googleusercontent.com"],
//             styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
//             fontSrc: ["'self'", "https://fonts.gstatic.com"],
//         },
//     })
// );
// app.use(helmet.crossOriginOpenerPolicy({ policy: "same-origin-allow-popups" })); // Add this line

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(compression());
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/stats', statsRoutes);

// Serve static files (should be placed after API routes)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
} else if (process.env.NODE_ENV === 'development') {
    app.get('/', (req: Request, res: Response) => {
        res.send('API is running... 🚀 [Development Mode]');
    });
}

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    winston.error(err.message, err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Server Error',
    });
});

app.use(apiErrorMiddleware);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
