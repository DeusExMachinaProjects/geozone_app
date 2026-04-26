import React from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ActivityModeScreen} from '../features/activity/screens/ActivityModeScreen';
import type {RootStackParamList} from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PET_CONFIG = {
  accentColor: '#FF6B52',
  accentSoft: 'rgba(255, 107, 82, 0.12)',
  buttonTextColor: '#FFFFFF',
  badge: 'PET',
  title: 'Modo Mascotas',
  subtitle: 'Pasea con tu compañero de forma segura y registra el recorrido, tiempo, distancia y ritmo general.',
  summaryTitle: 'Resumen rápido',
  summaryMetrics: [
    {label: 'DISTANCIA', value: '1.5 a 3 km'},
    {label: 'RITMO', value: 'Cómodo'},
    {label: 'EXIGENCIA', value: 'Moderada'},
  ],
  summaryLines: [
    'Pensado para paseos tranquilos y seguros, sin sobreesfuerzo.',
    'El tracking mantendrá el estilo de patas sobre el mapa durante el paseo.',
  ],
  recommendationsTitle: 'Cuidados del paseo',
  recommendations: [
    'Evita horas de mucho sol o superficies demasiado calientes.',
    'Lleva agua para ambos y haz pausas si es necesario.',
    'Observa jadeo excesivo, cansancio o detenciones repetidas.',
    'Si tu mascota cambia el ritmo, adapta el paso de inmediato.',
  ],
  primaryLabel: 'Iniciar paseo',
  helperText: 'Al iniciar se abrirá el tracking en vivo de mascotas.',
} as const;

export function PetScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ActivityModeScreen
      config={PET_CONFIG}
      onBack={() => navigation.goBack()}
      onStart={() => navigation.navigate('PetTracking')}
    />
  );
}
