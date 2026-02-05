import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AboutScreen } from '../screens/AboutScreen';
import { ActiveWorkoutScreen } from '../screens/ActiveWorkoutScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { CreateWorkoutScreen } from '../screens/CreateWorkoutScreen';
import { ExerciseDetailScreen } from '../screens/ExerciseDetailScreen';
import { mapFirebaseUser, useAuthStore } from '../store/authStore';
import { TabNavigator } from './TabNavigator';

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
      webClientId: '848121409302-3pkr6tju88ttloq06e73gdnvu3ve1vo3.apps.googleusercontent.com'
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
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="CreateWorkout" component={CreateWorkoutScreen} />
            <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
            <Stack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            {/* Add other modal/stack screens here that shouldn't be in the tab bar */}
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
