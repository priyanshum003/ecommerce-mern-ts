import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AllCouponsResponse, ApplyCouponRequest, ApplyCouponResponse, DeleteCouponRequest, MessageResponse, NewCouponRequest } from '../../types/api-types';

const server = import.meta.env.VITE_SERVER_URL;

export const couponApi = createApi({
    reducerPath: 'couponApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/v1/coupons/`,
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        getAllCoupons: builder.query<AllCouponsResponse, void>({
            query: () => 'all',
        }),
        createCoupon: builder.mutation<MessageResponse, NewCouponRequest>({
            query: (newCoupon) => ({
                url: 'new',
                method: 'POST',
                body: newCoupon,
            }),
        }),
        deleteCoupon: builder.mutation<MessageResponse, string>({
            query: (couponId) => ({
                url: `delete/${couponId}`,
                method: 'DELETE',
            }),
        }),
        applyCoupon: builder.mutation<ApplyCouponResponse, ApplyCouponRequest>({
            query: (coupon) => ({
                url: 'apply',
                method: 'POST',
                body: coupon,
            }),
        })
    }),
});

export const {
    useGetAllCouponsQuery,
    useCreateCouponMutation,
    useDeleteCouponMutation,
    useApplyCouponMutation,

} = couponApi;
