import React from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {PetTrackingView} from '../features/pet-tracking/components/PetTrackingView';
import {usePetTracking} from '../features/pet-tracking/hooks/usePetTracking';
import type {RootStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'PetTracking'>;

export function PetTrackingScreen({navigation}: Props) {
  const tracking = usePetTracking();

  return (
    <PetTrackingView
      tracking={tracking}
      onBack={() => navigation.goBack()}
    />
  );
}