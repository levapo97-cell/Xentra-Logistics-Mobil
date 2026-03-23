import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface ExpenseDetailSAR {
    id?: string;
    expense_id?: string;
    description: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    isv: number;
    total: number;
}

// Interface SAR
export interface ExpenseSAR {
    id?: string;
    fecha: string;
    tipo_documento: string;
    numero_factura: string;
    cai: string;
    fecha_limite_cai: string;
    rtn_proveedor: string;
    proveedor: string;
    descripcion: string;
    categoria: string;
    metodo_pago: string;
    subtotal: number;
    isv: number;
    total: number;
    estado: string;
    adjunto_url?: string;
    created_by?: string;
    details?: ExpenseDetailSAR[];
}

interface ExpenseState {
    items: ExpenseSAR[];
    loading: boolean;
    error: string | null;
}

const initialState: ExpenseState = {
    items: [],
    loading: false,
    error: null,
};

const API_URL = 'http://localhost:8080/api/expenses'; // URL local por defecto para testear

export const fetchExpenses = createAsyncThunk('expenses/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const createExpense = createAsyncThunk('expenses/create', async (expenseData: ExpenseSAR, { rejectWithValue }) => {
    try {
        const response = await axios.post(API_URL, expenseData);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

const expenseSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {
        clearExpenseError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchExpenses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExpenses.fulfilled, (state, action: PayloadAction<ExpenseSAR[]>) => {
                state.loading = false;
                state.items = action.payload || [];
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create
            .addCase(createExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createExpense.fulfilled, (state, action: PayloadAction<ExpenseSAR>) => {
                state.loading = false;
                state.items.unshift(action.payload);
            })
            .addCase(createExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearExpenseError } = expenseSlice.actions;
export default expenseSlice.reducer;
