import React from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ActivityModeScreen} from '../features/activity/screens/ActivityModeScreen';
import type {RootStackParamList} from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RIDE_CONFIG = {
  accentColor: '#FF3E38',
  accentSoft: 'rgba(255, 62, 56, 0.12)',
  buttonTextColor: '#FFFFFF',
  badge: 'RIDE',
  title: 'Modo Bicicleta',
  subtitle: 'Registra tu pedaleo con vista en vivo, distancia acumulada, velocidad y ascenso.',
  summaryTitle: 'Sesión sugerida',
  summaryMetrics: [
    {label: 'RUTA', value: '12 km'},
    {label: 'DESNIVEL', value: '180 m'},
    {label: 'TIEMPO', value: '45 min'},
  ],
  summaryLines: [
    'Ideal para recorridos urbanos o tramos mixtos con ritmo sostenido.',
    'El tracking mostrará un rastro de bicicleta sobre el mapa durante el recorrido.',
  ],
  recommendationsTitle: 'Preparación recomendada',
  recommendations: [
    'Revisa frenos, presión de neumáticos y ajuste general antes de salir.',
    'Usa casco y elementos reflectantes si habrá poca luz.',
    'Controla la velocidad en bajadas o zonas con tránsito.',
    'Si usas bici eléctrica, revisa carga y autonomía antes de iniciar.',
  ],
  primaryLabel: 'Iniciar pedaleo',
  helperText: 'Al iniciar se abrirá el tracking en vivo de bicicleta.',
} as const;

export function RideScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ActivityModeScreen
      config={RIDE_CONFIG}
      onBack={() => navigation.goBack()}
      onStart={() => navigation.navigate('RideTracking')}
    />
  );
}
