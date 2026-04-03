import React from 'react';
import {Pressable, StatusBar, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ScreenContainer} from '../components/ScreenContainer';
import {styles} from '../theme/screens/OptionsScreen.styles';

export function OptionsScreen() {
  const navigation = useNavigation();

  return (
    <ScreenContainer scroll contentStyle={styles.content}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </Pressable>

        <Text style={styles.title}>Opciones</Text>
        <Text style={styles.subtitle}>
          Configura tu perfil, notificaciones y preferencias de actividad.
        </Text>
      </View>

      <View style={styles.optionCard}>
        <Text style={styles.optionTitle}>Perfil</Text>
        <Text style={styles.optionText}>Editar nombre, avatar y biografía.</Text>
      </View>

      <View style={styles.optionCard}>
        <Text style={styles.optionTitle}>Notificaciones</Text>
        <Text style={styles.optionText}>
          Gestiona alertas de amigos, logros y misiones.
        </Text>
      </View>

      <View style={styles.optionCard}>
        <Text style={styles.optionTitle}>Privacidad</Text>
        <Text style={styles.optionText}>
          Define quién puede ver tus rutas y estadísticas.
        </Text>
      </View>
    </ScreenContainer>
  );
}