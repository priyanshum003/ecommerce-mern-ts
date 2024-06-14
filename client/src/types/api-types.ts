export interface User {
    uid: string;
    name: string;
    dob: string;
    gender: string;
    email: string;
    displayName: string;
    photoURL: string;
    provider: string;
    _id: string;
    role: "admin" | "user";
}
export type MessageResponse = {
    success: boolean;
    message: string;
}

export type UserLoginResponse = {
    success: boolean;
    user: User;
    token: string;
}

export type UserLoginRequest = {
    idToken: string;
}

export type UserRegisterRequest = {
    idToken: string;
    name: string;
    gender: string;
    dob: string
}

export type AllUserResponse = {
    success: boolean;
    users: User[];
}

export type UserResponse = {
    success: boolean;
    user: User;
}

export interface UserReducerIntialState {
    user: User | null;
    loading: boolean;
}

// Product
export interface Product {
    name: string;
    _id: string;
    category: string;
    stock: number;
    photo: string;
    price: number;
    description: string;
    featured: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ProductResponse {
    success: boolean;
    products: Product[];
    totalProducts: number;
    totalPages: number;
    currentPage: number;
}


interface SortBy {
    id: string;
    desc: boolean;
}

export interface ProductRequest {
    page: number;
    limit: number;
    sortBy?: SortBy;
}

// New Product
export type NewProductRequest = {
    formData: FormData;
}

// Product Details
export type ProductDetailResponse = {
    success: boolean;
    product: Product;
}

// Update Product
export type UpdateProductRequest = {
    productId: string;
    formData: FormData;
}

// Delete Product
export type DeleteProductRequest = {
    productId: string;
}

// Categories 
export type CategoriesResponse = {
    success: boolean;
    categories: string[];
}

// feature Product
export type FeatureProductRequest = {
    productId: string;
}

// Search Product
export type SearchProductRequest = {
    price: string;
    page: number;
    category: string;
    search: string;
    sort: string;
}

export type SearchProductResponse = ProductResponse & {
    totalPage: number;
}

// -- Order Types -- 
// Cart Item
export type CartItem = {
    productId: string;
    photo: string;
    name: string;
    price: number;
    quantity: number;
    stock: number;
};

// Shipping Info
export type ShippingInfo = {
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
    phone: string;
}

// Order Item
export type OrderItem = Omit<CartItem, "stock"> & { _id: string };

// Order 
export type Order = {
    orderItems: OrderItem[];
    shippingInfo: ShippingInfo;
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    status: string;
    user: {
        name: string;
        _id: string;
    };
    _id: string;
    createdAt: string;
    updatedAt: string;
}

// All Orders
export type AllOrdersResponse = {
    success: boolean;
    orders: Order[];
}

// Order Details
export type OrderDetailsResponse = {
    success: boolean;
    order: Order;
}

// New Order 
export type NewOrderRequest = {
    orderItems: CartItem[];
    subTotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    shippingInfo: ShippingInfo;
    userId: string;
}

// Update Order
export type UpdateOrderRequest = {
    orderId: string;
    status: string;
}

//  -- Coupon Types --
export type Coupon = {
    code: string;
    amount: number;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export type AllCouponsResponse = {
    success: boolean;
    coupons: Coupon[];
}

export type AllCouponsRequest = {
    page: number;
}

export type ApplyCouponRequest = {
    code: string;
}

export type ApplyCouponResponse = {
    success: boolean;
    coupon: Coupon;
    message: string;
}

export type NewCouponRequest = {
    code: string;
    amount: number | string;
}

export type DeleteCouponRequest = {
    couponId: string;
}

interface Stats {
    totalRevenue: number;
    revenueByMonth: {
        [key: string]: number;
    };
    revenueByWeek: {
        [key: string]: number;
    };
    revenueByDay: {
        [key: string]: number;
    };
    salesByCategory: {
        [key: string]: number;
    };
    bestSellingProducts: {
        productId: string;
        quantity: number;
    }[];
    userGenderDemographic: {
        _id: string;
        count: number;
    }[];
    totalOrders: number;
    latestOrders: Order[];
    totalProducts: number;
    totalCoupons: number;
}

// Stats
export interface StatsResponse {
    success: boolean;
    stats: Stats;
}



// -- Reducer Types --

// Cart Reducer Initial State
export interface CartReducerIntialState {
    loading: boolean;
    cartItems: CartItem[];
    subTotal: number;
    tax: number;
    total: number;
    shippingCharges: number;
    discount: number;
    shippingInfo: ShippingInfo;
}

export type CustomError = {
    status: number;
    data: {
        message: string;
        success: boolean;
    }
}