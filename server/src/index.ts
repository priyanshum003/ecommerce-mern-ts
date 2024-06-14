// Import environment variables
import dotenv from 'dotenv';
dotenv.config();

// Import external modules
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

// Import database and Firebase configurations
import connectDB from './config/db.config';
import firebaseApp from './config/firebase.config';

// Import routes
import authRoutes from './routes/auth.routes';
import couponRoutes from './routes/coupon.routes';
import orderRoutes from './routes/order.routes';
import paymentRoutes from './routes/payment.routes';
import productRoutes from './routes/product.route';
import statsRoutes from './routes/stats.route';

// Import middleware
import { apiErrorMiddleware } from './utils/ApiError';
import winston from 'winston';

// Initialize Firebase
firebaseApp.firestore();

// Initialize Express app
const app: Application = express();

// Set up environment variables
const PORT = process.env.PORT || 8000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Connect to MongoDB
connectDB();

// Set up middleware
app.use(cookieParser());
app.use(helmet());
app.use(cors({ credentials: true, origin: CLIENT_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(compression());
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api', limiter);

// Set up routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/stats', statsRoutes);


// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    winston.error(err.message, err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Server Error',
    });
});

app.use(apiErrorMiddleware);

// Set up default route
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Shopspot ;-)' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
