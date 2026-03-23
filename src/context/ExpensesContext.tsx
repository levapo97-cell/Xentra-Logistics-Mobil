import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Expense = {
    id: string;
    description: string;
    amount: number;
    date: string;           // ISO string, e.g. "2026-03-08"
    category: string;
    supplier?: string;
    receiptUri?: string;    // Foto / recibo (futuro)
    status?: string;        // Pendiente, Aprobada, etc.
};

type ExpensesContextType = {
    expenses: Expense[];
    addExpense: (expense: Omit<Expense, "id">) => void;
    removeExpense: (id: string) => void;
    updateExpense: (id: string, data: Partial<Omit<Expense, "id">>) => void;
    total: number;
};

// ─── Context ──────────────────────────────────────────────────────────────────

const ExpensesContext = createContext<ExpensesContextType | undefined>(
    undefined
);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ExpensesProvider({ children }: { children: ReactNode }) {
    const [expenses, setExpenses] = useState<Expense[]>([]);

    const addExpense = (expense: Omit<Expense, "id">) => {
        const newExpense: Expense = {
            ...expense,
            id: Date.now().toString(),
        };
        setExpenses((prev) => [newExpense, ...prev]);
    };

    const removeExpense = (id: string) =>
        setExpenses((prev) => prev.filter((e) => e.id !== id));

    const updateExpense = (
        id: string,
        data: Partial<Omit<Expense, "id">>
    ) =>
        setExpenses((prev) =>
            prev.map((e) => (e.id === id ? { ...e, ...data } : e))
        );

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    return (
        <ExpensesContext.Provider
            value={{ expenses, addExpense, removeExpense, updateExpense, total }}
        >
            {children}
        </ExpensesContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useExpenses(): ExpensesContextType {
    const ctx = useContext(ExpensesContext);
    if (!ctx) {
        throw new Error("useExpenses debe usarse dentro de <ExpensesProvider>");
    }
    return ctx;
}
