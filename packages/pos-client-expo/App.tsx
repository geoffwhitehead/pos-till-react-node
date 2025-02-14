import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Root } from 'native-base';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';

// Import your existing App component from src
import { App as MainApp } from './src/App';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Root>
            <MainApp />
            <StatusBar style="auto" />
          </Root>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

registerRootComponent(App);
