import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { CreateWorkoutScreen } from '../screens/CreateWorkoutScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { WorkoutsScreen } from '../screens/WorkoutsScreen';
import { mapFirebaseUser, useAuthStore } from '../store/authStore';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { user, setUser, loading, setLoading } = useAuthStore();
  const [initializing, setInitializing] = useState(true);

  // Handle user state changes
  function onAuthStateChanged(firebaseUser: any) {
    setUser(mapFirebaseUser(firebaseUser));
    if (initializing) setInitializing(false);
    setLoading(false);
  }

  useEffect(() => {
    GoogleSignin.configure({
      // TODO: Replace with your Web Client ID from Firebase Console -> Authentication -> Sign-in method -> Google -> Web SDK configuration
      // It usually looks like: "123456789-xxxxxx.apps.googleusercontent.com"
      webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', 
    });

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4ADE80" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Workouts" component={WorkoutsScreen} />
            <Stack.Screen name="CreateWorkout" component={CreateWorkoutScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
