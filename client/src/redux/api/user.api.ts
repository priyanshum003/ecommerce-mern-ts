import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserLoginRequest, UserLoginResponse, UserRegisterRequest, UserResponse } from '../../types/api-types';

export const userApi = createApi({
    reducerPath: 'userAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `/api/v1/auth/`,
        credentials: 'include',
    }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getAllUsers: builder.query({
            query: () => 'all',
        }),
        getUser: builder.query({
            query: (id: string) => `${id}`,
        }),
        loginUser: builder.mutation<UserLoginResponse, UserLoginRequest>({
            query: ({ idToken }) => ({
                url: 'login',
                method: 'POST',
                body: { idToken },
            }),
        }),
        signupUser: builder.mutation<UserLoginResponse, UserRegisterRequest>({
            query: ({ idToken, name, gender, dob }) => ({
                url: 'signup',
                method: 'POST',
                body: { idToken, name, gender, dob },
            }),
        }),
        getMe: builder.query<UserResponse, void>({
            query: () => 'me',
        }),
        logoutUser: builder.mutation<void, void>({
            query: () => ({
                url: 'logout',
                method: 'POST',
            })
        }),
    }),
});

export const {
    useGetAllUsersQuery,
    useGetUserQuery,
    useLoginUserMutation,
    useSignupUserMutation,
    useGetMeQuery,
    useLogoutUserMutation,
} = userApi;
