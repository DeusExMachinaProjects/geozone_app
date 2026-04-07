import React from 'react';
import {Pressable, StatusBar, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenContainer} from '../components/ScreenContainer';
import {styles} from '../theme/screens/PetScreen.styles';
import type {RootStackParamList} from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function PetScreen() {
  const navigation = useNavigation<NavigationProp>();

  const handleStartPetTracking = () => {
    navigation.navigate('PetTracking');
  };

  return (
    <ScreenContainer scroll={false} contentStyle={styles.content}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </Pressable>

        <Text style={styles.title}>Modo Mascotas</Text>
        <Text style={styles.subtitle}>
          Pasea con tu compañero de forma segura y registra su actividad.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resumen rápido</Text>
        <Text style={styles.cardText}>Distancia sugerida: 1.5 a 3 km</Text>
        <Text style={styles.cardText}>Ritmo recomendado: paseo cómodo y constante</Text>
        <Text style={styles.cardText}>Velocidad ideal: moderada, sin sobreesfuerzo</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cuidados del paseo</Text>
        <Text style={styles.cardText}>• Evita las horas de mucho sol</Text>
        <Text style={styles.cardText}>• Lleva agua para ambos</Text>
        <Text style={styles.cardText}>• Revisa que el suelo no queme</Text>
        <Text style={styles.cardText}>• Si jadea mucho o se detiene, baja el ritmo</Text>

        <Pressable style={styles.primaryButton} onPress={handleStartPetTracking}>
          <Text style={styles.primaryButtonText}>Iniciar paseo</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}