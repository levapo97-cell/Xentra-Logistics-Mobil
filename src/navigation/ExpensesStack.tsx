import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ExpensesScreen from "../screens/ExpensesScreen";
import OCRExpenseScreen from "../screens/OCRExpenseScreen";
import ExpenseFormScreen from "../screens/ExpenseFormScreen";

export type ExpensesStackParamList = {
    ExpensesHome: undefined;
    OCRExpense: undefined;
    ExpenseForm: undefined;
};

const Stack = createNativeStackNavigator<ExpensesStackParamList>();

export default function ExpensesStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ExpensesHome" component={ExpensesScreen} />
            <Stack.Screen name="OCRExpense" component={OCRExpenseScreen} />
            <Stack.Screen name="ExpenseForm" component={ExpenseFormScreen} />
        </Stack.Navigator>
    );
}
