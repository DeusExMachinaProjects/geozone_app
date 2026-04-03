import React from 'react';
import {Pressable, StatusBar, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenContainer} from '../components/ScreenContainer';
import {styles} from '../theme/screens/RunScreen.styles';
import type {RootStackParamList} from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function RunScreen() {
  const navigation = useNavigation<NavigationProp>();

  const handleStartRun = () => {
    navigation.navigate('RunTracking');
  };

  return (
    <ScreenContainer scroll contentStyle={styles.content}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </Pressable>

        <Text style={styles.title}>Modo Correr</Text>
        <Text style={styles.subtitle}>Activa tu sesión y domina nuevas zonas.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resumen rápido</Text>
        <Text style={styles.cardText}>Distancia objetivo: 5 km</Text>
        <Text style={styles.cardText}>Ritmo estimado: 5:40 min/km</Text>
        <Text style={styles.cardText}>Calorías aprox: 410 kcal</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Inicio de actividad</Text>
        <Text style={styles.cardText}>
          Desde aquí luego puedes conectar GPS, temporizador y mapa en vivo.
        </Text>

        <Pressable style={styles.primaryButton} onPress={handleStartRun}>
          <Text style={styles.primaryButtonText}>Iniciar carrera</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}