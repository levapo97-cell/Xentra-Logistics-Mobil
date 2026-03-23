import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InventoryListScreen from "../screens/InventoryListScreen";
import BarcodeScannerScreen from "../screens/BarcodeScannerScreen";

export type InventoryStackParamList = {
    InventoryHome: undefined;
    BarcodeScanner: undefined;
};

const Stack = createNativeStackNavigator<InventoryStackParamList>();

export default function InventoryStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="InventoryHome" component={InventoryListScreen} />
            <Stack.Screen name="BarcodeScanner" component={BarcodeScannerScreen} />
        </Stack.Navigator>
    );
}
