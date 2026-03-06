import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SalesScreen from "../screens/SalesScreen";
import ExpensesScreen from "../screens/ExpensesScreen";
import ProfileScreen from "../screens/ProfileScreen";

export type MainTabsParamList = {
  Sales: undefined;
  Expenses: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

export default function MainTabs({ onLogout }: { onLogout: () => void }) {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Sales" component={SalesScreen} />
      <Tab.Screen name="Expenses" component={ExpensesScreen} />
      <Tab.Screen name="Profile">
        {(props) => <ProfileScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}