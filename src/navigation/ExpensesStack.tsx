import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ExpensesScreen from "../screens/ExpensesScreen";
import OCRExpenseScreen from "../screens/OCRExpenseScreen";
import ExpenseFormScreen from "../screens/ExpenseFormScreen";
import GastosListScreen from "../screens/gastos/GastosListScreen";
import DepartamentosScreen from "../screens/gastos/DepartamentosScreen";
import CategoriasScreen from "../screens/gastos/CategoriasScreen";
import SubcategoriasScreen from "../screens/gastos/SubcategoriasScreen";
import DivisionesScreen from "../screens/gastos/DivisionesScreen";

export type ExpensesStackParamList = {
    ExpensesHome: undefined;
    GastosList: undefined;
    Departamentos: undefined;
    Categorias: undefined;
    Subcategorias: undefined;
    Divisiones: undefined;
    OCRExpense: undefined;
    ExpenseForm: undefined;
};

const Stack = createNativeStackNavigator<ExpensesStackParamList>();

export default function ExpensesStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ExpensesHome" component={ExpensesScreen} />
            <Stack.Screen name="GastosList" component={GastosListScreen} />
            <Stack.Screen name="Departamentos" component={DepartamentosScreen} />
            <Stack.Screen name="Categorias" component={CategoriasScreen} />
            <Stack.Screen name="Subcategorias" component={SubcategoriasScreen} />
            <Stack.Screen name="Divisiones" component={DivisionesScreen} />
            <Stack.Screen name="OCRExpense" component={OCRExpenseScreen} />
            <Stack.Screen name="ExpenseForm" component={ExpenseFormScreen} />
        </Stack.Navigator>
    );
}
