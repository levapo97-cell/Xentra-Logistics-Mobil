import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SalesDocType, SalesDoc } from "../context/SalesContext";
import SalesHomeScreen from "../screens/SalesHomeScreen";
import SalesListScreen from "../screens/SalesListScreen";
import SalesFormScreen from "../screens/SalesFormScreen";
import SalesDetailScreen from "../screens/SalesDetailScreen";

export type SalesStackParamList = {
    SalesHome: undefined;
    SalesList: { type: SalesDocType };
    SalesForm: { type: SalesDocType; doc?: SalesDoc };   // doc = undefined → crear, doc = existing → editar
    SalesDetail: { doc: SalesDoc; type: SalesDocType };
};

const Stack = createNativeStackNavigator<SalesStackParamList>();

export default function SalesStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SalesHome" component={SalesHomeScreen} />
            <Stack.Screen name="SalesList" component={SalesListScreen} />
            <Stack.Screen name="SalesForm" component={SalesFormScreen} />
            <Stack.Screen name="SalesDetail" component={SalesDetailScreen} />
        </Stack.Navigator>
    );
}
