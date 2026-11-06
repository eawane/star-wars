import 'react-native-gesture-handler';
import React from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Each screen currently displays its name.
function Screen({ route }) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{route.name}</Text>
    </View>
  );
}

// Android uses a drawer; iOS and the web preview use bottom tabs.
function AppNavigation() {
  if (Platform.OS === 'android') {
    return (
      <Drawer.Navigator initialRouteName="Planets">
        <Drawer.Screen name="Planets" component={Screen} />
        <Drawer.Screen name="Films" component={Screen} />
        <Drawer.Screen name="Spaceships" component={Screen} />
      </Drawer.Navigator>
    );
  }

  return (
    <Tab.Navigator
      initialRouteName="Planets"
      screenOptions={{
        tabBarActiveTintColor: '#806000',
        tabBarIcon: ({ color }) => (
          <Text style={{ color, fontSize: 20 }}>★</Text>
        ),
      }}
    >
      <Tab.Screen name="Planets" component={Screen} />
      <Tab.Screen name="Films" component={Screen} />
      <Tab.Screen name="Spaceships" component={Screen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigation />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#101820',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffe81f',
  },
});
