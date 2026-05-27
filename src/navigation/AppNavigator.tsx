import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { C } from '../theme';

import LoginScreen from '../screens/LoginScreen';
import MyTasksScreen from '../screens/MyTasksScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import AllTasksScreen from '../screens/AllTasksScreen';

export type RootStackParams = {
  Main: undefined;
  TaskDetail: { shopTaskId: number; taskTitle: string };
};

export type TabParams = {
  MyTasks: undefined;
  AllTasks: undefined;
};

const Stack = createNativeStackNavigator<RootStackParams>();
const Tab   = createBottomTabNavigator<TabParams>();

const tabBarStyle = {
  backgroundColor: C.surface,
  borderTopColor:  C.border,
};

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = { MyTasks: '✅', AllTasks: '📋' };
  return <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.5 }}>{icons[name]}</Text>;
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle:       { backgroundColor: C.surface },
        headerTintColor:   C.text,
        headerTitleStyle:  { fontWeight: '600' },
        tabBarStyle,
        tabBarActiveTintColor:   C.primary,
        tabBarInactiveTintColor: C.textMuted,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen
        name="MyTasks"
        component={MyTasksScreen}
        options={{ title: 'My Tasks', tabBarLabel: 'My Tasks' }}
      />
      <Tab.Screen
        name="AllTasks"
        component={AllTasksScreen}
        options={{ title: 'All Tasks', tabBarLabel: 'All Tasks' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const token = useAuthStore((s) => s.token);

  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: C.primary,
          background: C.bg,
          card: C.surface,
          text: C.text,
          border: C.border,
          notification: C.primary,
        },
        fonts: {
          regular: { fontFamily: 'System', fontWeight: 'normal' },
          medium:  { fontFamily: 'System', fontWeight: '500' },
          bold:    { fontFamily: 'System', fontWeight: '700' },
          heavy:   { fontFamily: 'System', fontWeight: '900' },
        },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          <Stack.Screen name="Main" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="TaskDetail"
              component={TaskDetailScreen}
              options={({ route }) => ({
                headerShown: true,
                title: route.params.taskTitle,
                headerStyle:      { backgroundColor: C.surface },
                headerTintColor:  C.text,
                headerTitleStyle: { fontWeight: '600' },
              })}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
