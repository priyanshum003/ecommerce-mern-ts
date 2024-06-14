// config/config.ts

import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI 

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, { dbName: "shopspot" });
        console.log('MongoDB connected');
    } catch (error) {
        console.log('MongoDB connection error:', error);
    }
}

export default connectDB;