import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';

import {SplashScreen} from '../screens/SplashScreen';
import {OnboardingScreen} from '../screens/OnboardingScreen';
import {AuthScreen} from '../screens/AuthScreen';
import {RegisterScreen} from '../screens/RegisterScreen';
import {RunScreen} from '../screens/RunScreen';
import {RideScreen} from '../screens/RideScreen';
import {OptionsScreen} from '../screens/OptionsScreen';
import {MissionsScreen} from '../screens/MissionsScreen';
import {RunTrackingScreen} from '../screens/RunTrackingScreen';
import {RideTrackingScreen} from '../screens/RideTrackingScreen';
import {PetTrackingScreen} from '../screens/PetTrackingScreen';
import {PetScreen} from '../screens/PetScreen';
import AvatarScreen from '../screens/AvatarScreen';

import {AppTabs} from './AppTabs';
import {colors} from '../theme';
import {useAuth} from '../app/providers/AuthProvider';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.background,
    primary: colors.primary,
    text: colors.text,
    border: colors.border,
  },
};

export function RootNavigator() {
  const {status} = useAuth();

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}>
        {status === 'loading' ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : status === 'authenticated' ? (
          <>
            <Stack.Screen name="MainTabs" component={AppTabs} />

            <Stack.Screen name="Run" component={RunScreen} />
            <Stack.Screen name="Ride" component={RideScreen} />
            <Stack.Screen name="Options" component={OptionsScreen} />
            <Stack.Screen name="Missions" component={MissionsScreen} />
            <Stack.Screen name="RunTracking" component={RunTrackingScreen} />
            <Stack.Screen name="RideTracking" component={RideTrackingScreen} />
            <Stack.Screen name="PetTracking" component={PetTrackingScreen} />
            <Stack.Screen name="Pet" component={PetScreen} />
            <Stack.Screen name="Avatar" component={AvatarScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}