import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ScreenContainer} from '../components/ScreenContainer';
import {PrimaryButton} from '../components/PrimaryButton';
import {colors, radius, spacing} from '../theme';

export function MapScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.title}>Mapa de conquista</Text>
      <Text style={styles.subtitle}>
        Aquí irá tu integración real con MapView, geolocalización, polígonos y
        zonas capturadas.
      </Text>

      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapPlaceholderTitle}>MAPA GEOZONE</Text>
        <Text style={styles.mapPlaceholderText}>
          Futuro módulo: rutas, heatmap, territorios, overlays y captura por
          área.
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Zona actual</Text>
        <Text style={styles.infoText}>Sector Centro Norte · 0.84 km² controlados</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Riesgo de invasión</Text>
        <Text style={styles.infoText}>
          2 corredores rivales activos cerca de tu perímetro principal.
        </Text>
      </View>

      <PrimaryButton title="Iniciar actividad" onPress={() => {}} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  mapPlaceholder: {
    height: 260,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1.5,
    borderColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  mapPlaceholderTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primaryDark,
    marginBottom: spacing.sm,
  },
  mapPlaceholderText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  infoText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
  },
});