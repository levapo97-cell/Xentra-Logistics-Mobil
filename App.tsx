import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { ExpensesProvider } from './src/context/ExpensesContext';
import { SalesProvider } from './src/context/SalesContext';

export default function App() {
  return (
    <AuthProvider>
      <SalesProvider>
        <ExpensesProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </ExpensesProvider>
      </SalesProvider>
    </AuthProvider>
  );
}