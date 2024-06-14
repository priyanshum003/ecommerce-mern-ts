import mongoose from "mongoose";

interface IProduct extends Document {
    name: string;
    category: string;
    description: string;
    stock: number;
    price: number;
    photo: string;
    photoPublicId: string;
    featured: boolean;
}

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"]
    },
    photo: {
        type: String,
        required: [true, "Product photo is required"]
    },
    photoPublicId: {
        type: String,
    },
    price: {
        type: Number,
        required: [true, "Product price is required"]
    },
    stock: {
        type: Number,
        required: [true, "Product stock is required"]
    },
    category: {
        type: String,
        required: [true, "Product category is required"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Product description is required"],
    },
    featured: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

export const Product = mongoose.model<IProduct>("Product", productSchema);