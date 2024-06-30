import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./api/user.api";
import { productApi } from "./api/product.api";
import { orderApi } from "./api/order.api";
import userReducer from "./reducers/user.reducer";
import cartReducer from "./reducers/cart.reducer";
import { couponApi } from "./api/coupon.api";
import { paymentApi } from "./api/payment.api";
import { statsApi } from "./api/stats.api";

const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer,
        [userApi.reducerPath]: userApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [couponApi.reducerPath]: couponApi.reducer,
        [paymentApi.reducerPath]: paymentApi.reducer,
        [statsApi.reducerPath]: statsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            userApi.middleware,
            productApi.middleware,
            orderApi.middleware,
            couponApi.middleware,
            paymentApi.middleware,
            statsApi.middleware
        )
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
