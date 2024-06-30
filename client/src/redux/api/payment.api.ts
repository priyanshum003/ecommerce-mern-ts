import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface CreatePaymentIntentRequest {
  amount: number;
}

export interface CreatePaymentIntentResponse {
  success: boolean;
  client_secret: string;
  message: string;
}

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/v1/payments`,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation<CreatePaymentIntentResponse, CreatePaymentIntentRequest>({
      query: (paymentIntent) => ({
        url: 'new',
        method: 'POST',
        body: paymentIntent,
      }),
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
} = paymentApi;
