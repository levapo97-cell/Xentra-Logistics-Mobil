import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import userReducer from './slices/userSlice';
import inventoryReducer from './slices/inventorySlice';
import expenseReducer from './slices/expenseSlice';

export const store = configureStore({
    reducer: {
        app: appReducer,
        user: userReducer,
        inventory: inventoryReducer,
        expenses: expenseReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

console.log('[Redux - Store] Store configurado exitosamente con reducers: app, user, inventory, expenses');
