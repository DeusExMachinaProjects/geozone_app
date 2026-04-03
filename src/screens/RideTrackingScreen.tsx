import React from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ActivityTrackingView} from '../features/tracking/components/ActivityTrackingView';
import {useActivityTracking} from '../features/tracking/hooks/useActivityTracking';
import type {RootStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'RideTracking'>;

export function RideTrackingScreen({navigation}: Props) {
  const tracking = useActivityTracking({activityType: 'ride'});

  return (
    <ActivityTrackingView
      activityType="ride"
      tracking={tracking}
      onBack={() => navigation.goBack()}
    />
  );
}