import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Session, User } from '@supabase/supabase-js';

interface UserState {
    user: User | null;
    session: Session | null;
    isAuthenticated: boolean;
    loading: boolean;
}

const initialState: UserState = {
    user: null,
    session: null,
    isAuthenticated: false,
    loading: true,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setSession: (state, action: PayloadAction<{ session: Session | null; user: User | null }>) => {
            state.session = action.payload.session;
            state.user = action.payload.user;
            state.isAuthenticated = !!action.payload.session;
            state.loading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        logoutUser: (state) => {
            state.user = null;
            state.session = null;
            state.isAuthenticated = false;
            state.loading = false;
        },
    },
});

export const { setSession, setLoading, logoutUser } = userSlice.actions;
export default userSlice.reducer;
