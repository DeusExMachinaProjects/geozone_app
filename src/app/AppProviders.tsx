import React, {useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AuthProvider} from './providers/AuthProvider';
import {bootstrapNotifications} from './bootstrap/notifications';
import {bootstrapTracking} from './bootstrap/tracking';

type Props = {
  children: React.ReactNode;
};

export function AppProviders({children}: Props) {
  useEffect(() => {
    void bootstrapNotifications();
    void bootstrapTracking();
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <AuthProvider>{children}</AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}