import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Dumbbell, History, Home, List, User } from 'lucide-react-native';
import React from 'react';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ExercisesScreen } from '../screens/ExercisesScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { WorkoutsScreen } from '../screens/WorkoutsScreen';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1F2937', // Gray 800
          borderTopColor: '#374151', // Gray 700
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#4ADE80', // Green 400
        tabBarInactiveTintColor: '#9CA3AF', // Gray 400
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="WorkoutsTab"
        component={WorkoutsScreen}
        options={{
          tabBarLabel: 'Workouts',
          tabBarIcon: ({ color, size }) => <Dumbbell color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ExercisesTab"
        component={ExercisesScreen}
        options={{
          tabBarLabel: 'Exercises',
          tabBarIcon: ({ color, size }) => <List color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ color, size }) => <History color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};
