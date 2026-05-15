import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text } from 'react-native';
import { useApp } from '../context/AppContext';

import HomeScreen from '../screens/HomeScreen';
import DigitalWalletScreen from '../screens/DigitalWalletScreen';
import VaultScreen from '../screens/VaultScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabIcon({ name, color, size }: { name: string; color: string; size: number }) {
  const iconMap: Record<string, string> = {
    'AnaSayfa': '🏠', 'Cüzdan': '👛', 'Kasa': '🔒', 'Analitik': '📊', 'Ayarlar': '⚙️',
  };
  return <Text style={{ fontSize: size - 4, color }}>{iconMap[name] || '📱'}</Text>;
}

function MainTabs() {
  const { theme } = useApp();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => <TabIcon name={route.name} color={color} size={size} />,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textTertiary,
        tabBarStyle: { backgroundColor: theme.background, borderTopColor: theme.border, height: 80, paddingBottom: 20, paddingTop: 8 },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        headerStyle: { backgroundColor: theme.background, shadowColor: 'transparent', elevation: 0 },
        headerTintColor: theme.text,
        headerTitleStyle: { fontWeight: 'bold' },
        cardStyle: { backgroundColor: theme.background },
      })}
    >
      <Tab.Screen name="AnaSayfa" component={HomeScreen} options={{ title: 'Ana Sayfa', tabBarLabel: 'Ana Sayfa' }} />
      <Tab.Screen name="Cüzdan" component={DigitalWalletScreen} options={{ title: 'Dijital Cüzdan', tabBarLabel: 'Cüzdan' }} />
      <Tab.Screen name="Kasa" component={VaultScreen} options={{ title: 'Şifre Kasası', tabBarLabel: 'Kasa' }} />
      <Tab.Screen name="Analitik" component={AnalyticsScreen} options={{ title: 'Analitik', tabBarLabel: 'Analitik' }} />
      <Tab.Screen name="Ayarlar" component={SettingsScreen} options={{ title: 'Ayarlar', tabBarLabel: 'Ayarlar' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { theme } = useApp();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.background, elevation: 0, shadowOpacity: 0 },
          headerTintColor: theme.text,
          headerTitleStyle: { fontWeight: 'bold' },
          cardStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
