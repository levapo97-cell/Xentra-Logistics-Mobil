import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Text, Platform, View } from "react-native";
import { theme } from "../theme/theme";

import SalesStack from "./SalesStack";
import ExpensesStack from "./ExpensesStack"; 
import InventoryStack from "./InventoryStack";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.muted,
                tabBarStyle: {
                    height: Platform.OS === "ios" ? 85 : 65,
                    backgroundColor: "#0B0B0F",
                    borderTopWidth: 1,
                    borderTopColor: "rgba(255,255,255,0.05)",
                    paddingBottom: Platform.OS === "ios" ? 25 : 10,
                    paddingTop: 10,
                },
                tabBarLabel: ({ focused, color }) => (
                    <Text style={{ fontSize: 10, color, fontWeight: focused ? "700" : "500", marginTop: 4 }}>
                        {route.name === "Sales" ? "Ventas"
                         : route.name === "Expenses" ? "Gastos"
                         : route.name === "Inventory" ? "Stock"
                         : "Perfil"}
                    </Text>
                ),
                tabBarIcon: ({ color, focused }) => {
                    let iconName: any;
                    if (route.name === "Sales") iconName = focused ? "briefcase" : "briefcase-outline";
                    else if (route.name === "Expenses") iconName = focused ? "wallet" : "wallet-outline";
                    else if (route.name === "Inventory") iconName = focused ? "cube" : "cube-outline";
                    else if (route.name === "Profile") iconName = focused ? "person-circle" : "person-circle-outline";

                    return (
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name={iconName} size={24} color={color} />
                            {focused && (
                                <View style={{
                                    position: 'absolute',
                                    bottom: -18,
                                    width: 4,
                                    height: 4,
                                    borderRadius: 2,
                                    backgroundColor: theme.colors.primary
                                }}/>
                            )}
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen name="Sales" component={SalesStack} />
            <Tab.Screen name="Expenses" component={ExpensesStack} />
            <Tab.Screen name="Inventory" component={InventoryStack} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}