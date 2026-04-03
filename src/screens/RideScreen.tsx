import React from 'react';
import {Pressable, StatusBar, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenContainer} from '../components/ScreenContainer';
import {styles} from '../theme/screens/RideScreen.styles';
import type {RootStackParamList} from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function RideScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ScreenContainer scroll contentStyle={styles.content}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </Pressable>

        <Text style={styles.title}>Modo Pedalear</Text>
        <Text style={styles.subtitle}>
          Sigue rutas, gana XP y registra tus recorridos en bici.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sesión sugerida</Text>
        <Text style={styles.cardText}>Ruta urbana: 12 km</Text>
        <Text style={styles.cardText}>Desnivel: 180 m</Text>
        <Text style={styles.cardText}>Tiempo estimado: 45 min</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Preparación</Text>
        <Text style={styles.cardText}>
          Revisa casco, neumáticos y batería si usas bicicleta eléctrica.
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.navigate('RideTracking')}>
          <Text style={styles.primaryButtonText}>Iniciar pedaleo</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}