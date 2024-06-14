import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CartReducerIntialState, CartItem, ShippingInfo } from "../../types/api-types";

const initialState: CartReducerIntialState = {
    loading: false,
    cartItems: JSON.parse(localStorage.getItem('cartItems') || '[]'),
    subTotal: 0,
    tax: 0,
    shippingCharges: 0,
    discount: 0,
    total: 0,
    shippingInfo: JSON.parse(localStorage.getItem('shippingInfo') || JSON.stringify({
        address: '',
        city: '',
        state: '',
        country: '',
        pinCode: '',
        phone: ''
    }))
};

const saveToLocalStorage = (state: CartReducerIntialState) => {
    localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    localStorage.setItem('shippingInfo', JSON.stringify(state.shippingInfo));
};

export const cartReducer = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            state.loading = true;

            const index = state.cartItems.findIndex(item => item.productId === action.payload.productId);

            if (index !== -1) {
                // If the item already exists in the cart, increment its quantity
                // Limit the quantity to the stock available
                state.cartItems[index].quantity = Math.min(state.cartItems[index].quantity + action.payload.quantity, action.payload.stock);
            } else {
                // If the item doesn't exist in the cart, add it
                state.cartItems.push(action.payload);
            }

            state.loading = false;
            saveToLocalStorage(state); // Save to localStorage
        },
        removeCartItem: (state, action: PayloadAction<string>) => {
            state.loading = true;
            state.cartItems = state.cartItems.filter(item => item.productId !== action.payload);
            state.loading = false;
            saveToLocalStorage(state); // Save to localStorage
        },
        incrementCartItem: (state, action: PayloadAction<string>) => {
            const item = state.cartItems.find(item => item.productId === action.payload);
            if (item && item.quantity < item.stock) {
                item.quantity += 1;
                saveToLocalStorage(state); // Save to localStorage
            }
        },
        decrementCartItem: (state, action: PayloadAction<string>) => {
            const item = state.cartItems.find(item => item.productId === action.payload);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                saveToLocalStorage(state); // Save to localStorage
            } else if (item && item.quantity === 1) {
                state.cartItems = state.cartItems.filter(item => item.productId !== action.payload);
                saveToLocalStorage(state); // Save to localStorage
            }
        },
        calculatePrice: (state) => {
            const subTotal = state.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
            state.subTotal = subTotal;
            state.shippingCharges = state.cartItems && state.cartItems.length > 0 ? 50 : 0;
            state.tax = Math.round(0.18 * state.subTotal);
            state.total = state.subTotal + state.shippingCharges + state.tax - state.discount;
            // If the discount is greater than the total price, limit the discount to the total price
            if (state.total < 0) {
                state.discount = state.subTotal + state.shippingCharges + state.tax;
                state.total = 0;
            }
        },
        discountApplied: (state, action: PayloadAction<number>) => {
            state.discount = action.payload;
            // If the discount is greater than the total price, limit the discount to the total price
            if (state.discount > state.total) {
                state.discount = state.total;
            }
            saveToLocalStorage(state); // Save to localStorage
        },
        saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
            state.shippingInfo = action.payload;
            saveToLocalStorage(state); // Save to localStorage
        },
        resetCart: () => {
            localStorage.removeItem('cartItems');
            localStorage.removeItem('shippingInfo');
            return initialState;
        }
    }
});

export const { addToCart, removeCartItem, incrementCartItem, decrementCartItem, calculatePrice, discountApplied, resetCart, saveShippingInfo } = cartReducer.actions;
export default cartReducer.reducer;