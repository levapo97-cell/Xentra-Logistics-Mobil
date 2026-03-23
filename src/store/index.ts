import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';

export const store = configureStore({
    reducer: {
        app: appReducer,
        // Aquí se agregarán los futuros reducers (sales, expenses, auth, etc.)
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
