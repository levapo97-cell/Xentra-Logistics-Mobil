import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
    theme: 'light' | 'dark';
    isLoading: boolean;
}

const initialState: AppState = {
    theme: 'dark',
    isLoading: false,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.theme = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

export const { setTheme, setLoading } = appSlice.actions;
export default appSlice.reducer;
