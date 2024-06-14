import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserReducerIntialState } from "../../types/api-types";
import { User } from "../../types";

const initialState: UserReducerIntialState = {
    user: null,
    loading: true
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        userExists: (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.user = action.payload;
        },
        userNotExists: (state) => {
            state.loading = false;
            state.user = null;
        }
    }
});

export const { userExists, userNotExists } = userSlice.actions;

export default userSlice.reducer;
