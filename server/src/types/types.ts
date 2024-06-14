import { Request } from 'express';
import { Document } from 'mongoose';

export interface NewProductBody {
    name: string;
    category: string;
    price: number;
    stock: number;
    description: string;
}

export interface BaseQueryType {
    name?: { $regex: string, $options: string };
    category?: string;
    price?: { $gte?: number, $lte?: number };
}

export interface SearchProductsQuery {
    search?: string;
    category?: string;
    sort?: 'asc' | 'desc' | 'relevance';    
    price?: string; // Assuming price is in the format "min,max"
    page?: string;
}

export interface User {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    provider: string;
    role: 'user' | 'admin';
    _id: string;
}


export interface RequestWithUser extends Request {
    user: User;
}

// Order Types

export type OrderItemType = {
    name: string;
    photo: string;
    price: number;
    quantity: number;
    productId: string;
}

export type ShippingInfoType = {
    address: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
    phone: string;
}

export interface NewOrderRequestBody {
    shippingInfo: ShippingInfoType;
    subTotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    orderItems: OrderItemType[];
}