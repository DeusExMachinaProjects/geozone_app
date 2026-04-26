import React from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ActivityModeScreen} from '../features/activity/screens/ActivityModeScreen';
import type {RootStackParamList} from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RUN_CONFIG = {
  accentColor: '#78E35E',
  accentSoft: 'rgba(120, 227, 94, 0.12)',
  buttonTextColor: '#050505',
  badge: 'RUN',
  title: 'Modo Correr',
  subtitle: 'Inicia una carrera, registra tu ruta y controla distancia, tiempo, velocidad y ascenso.',
  summaryTitle: 'Resumen rápido',
  summaryMetrics: [
    {label: 'OBJETIVO', value: '5 km'},
    {label: 'RITMO', value: '5:40 min/km'},
    {label: 'INTENSIDAD', value: 'Media'},
  ],
  summaryLines: [
    'Sesión ideal para trabajar cardio y mantener constancia.',
    'El seguimiento mostrará el recorrido en línea, junto con tu progreso en tiempo real.',
  ],
  recommendationsTitle: 'Antes de empezar',
  recommendations: [
    'Haz 3 a 5 minutos de movilidad o trote suave antes de acelerar.',
    'Mantén un ritmo controlado al inicio para evitar fatiga temprana.',
    'Si el terreno sube, prioriza constancia antes que velocidad.',
    'Lleva agua si la sesión será larga o con mucho calor.',
  ],
  primaryLabel: 'Iniciar carrera',
  helperText: 'Al iniciar se abrirá el tracking en vivo de running.',
} as const;

export function RunScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ActivityModeScreen
      config={RUN_CONFIG}
      onBack={() => navigation.goBack()}
      onStart={() => navigation.navigate('RunTracking')}
    />
  );
}
