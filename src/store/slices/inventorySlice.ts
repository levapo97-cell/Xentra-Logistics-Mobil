import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
    id: string;
    code: string;
    description: string;
    price: number;
    stock: number;
}

interface InventoryState {
    items: Product[];
    totalItems: number;
}

const initialState: InventoryState = {
    items: [],
    totalItems: 0,
};

const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {
        addProduct: (state, action: PayloadAction<Product>) => {
            const exists = state.items.find(item => item.id === action.payload.id);
            if (!exists) {
                state.items.push(action.payload);
                state.totalItems = state.items.length;
                console.log(`[Redux - inventorySlice] Producto agregado: ${action.payload.description}`);
                console.log(`[Redux - inventorySlice] Cantidad total actual de productos: ${state.totalItems}`);
            } else {
                console.log(`[Redux - inventorySlice] El producto ya existe en el inventario: ${action.payload.description}`);
            }
        },
        clearProducts: (state) => {
            state.items = [];
            state.totalItems = 0;
            console.log('[Redux - inventorySlice] Se ha limpiado la lista global de productos.');
        },
    },
});

export const { addProduct, clearProducts } = inventorySlice.actions;
export default inventorySlice.reducer;
