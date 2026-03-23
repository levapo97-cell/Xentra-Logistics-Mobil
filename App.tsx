import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { ExpensesProvider } from './src/context/ExpensesContext';
import { SalesProvider } from './src/context/SalesContext';

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <SalesProvider>
          <ExpensesProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </ExpensesProvider>
        </SalesProvider>
      </AuthProvider>
    </Provider>
  );
}