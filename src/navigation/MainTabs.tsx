import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import SalesStack from "./SalesStack";
import ExpensesScreen from "../screens/ExpensesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { theme } from "../theme/theme";

export type MainTabsParamList = {
  Sales: undefined;
  Expenses: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

const TAB_ICONS: Record<string, { active: IoniconsName; inactive: IoniconsName }> = {
  Sales: { active: "cart", inactive: "cart-outline" },
  Expenses: { active: "wallet", inactive: "wallet-outline" },
  Profile: { active: "person-circle", inactive: "person-circle-outline" },
};

export default function MainTabs({ onLogout }: { onLogout: () => void }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingBottom: 6,
          paddingTop: 6,
          height: 62,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.active : icons.inactive;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Sales"
        component={SalesStack}
        options={{ tabBarLabel: "Ventas" }}
      />
      <Tab.Screen
        name="Expenses"
        component={ExpensesScreen}
        options={{ tabBarLabel: "Gastos" }}
      />
      <Tab.Screen name="Profile" options={{ tabBarLabel: "Perfil" }}>
        {(props: object) => <ProfileScreen {...(props as any)} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}