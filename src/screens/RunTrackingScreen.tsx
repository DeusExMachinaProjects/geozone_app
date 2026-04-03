import React from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ActivityTrackingView} from '../features/tracking/components/ActivityTrackingView';
import {useActivityTracking} from '../features/tracking/hooks/useActivityTracking';
import type {RootStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'RunTracking'>;

export function RunTrackingScreen({navigation}: Props) {
  const tracking = useActivityTracking({activityType: 'run'});

  return (
    <ActivityTrackingView
      activityType="run"
      tracking={tracking}
      onBack={() => navigation.goBack()}
    />
  );
}