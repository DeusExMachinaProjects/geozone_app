import React from 'react';
import {
  Modal,
  Pressable,
  StatusBar,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {styles} from '../../../theme/screens/ActivityTrackingScreen.styles';
import type {ActivityType} from '../types';
import type {UseActivityTrackingResult} from '../hooks/useActivityTracking';
import {TrackingMap} from './TrackingMap';

type Props = {
  activityType: ActivityType;
  tracking: UseActivityTrackingResult;
  onBack: () => void;
};

function getCopy(activityType: ActivityType) {
  if (activityType === 'ride') {
    return {
      title: 'Pedaleo en curso',
      subtitle: 'GPS, mapa y métricas registrándose en vivo.',
    };
  }

  return {
    title: 'Carrera en curso',
    subtitle: 'GPS, mapa y métricas registrándose en vivo.',
  };
}

function formatCoordinate(value: number) {
  return value.toFixed(6);
}

export function ActivityTrackingView({
  activityType,
  tracking,
  onBack,
}: Props) {
  const insets = useSafeAreaInsets();
  const {height} = useWindowDimensions();

  const copy = getCopy(activityType);
  const mapHeight = Math.max(210, Math.min(290, height * 0.33));
  const statCardHeight = height < 760 ? 82 : 90;

  const handleBackFromSummary = () => {
    tracking.closeSummary();
    onBack();
  };

  const hasLocation = Boolean(tracking.currentLocation);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + 12,
            paddingBottom: Math.max(insets.bottom + 12, 16),
          },
        ]}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>← Volver</Text>
        </Pressable>

        <View style={styles.headerBlock}>
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.subtitle}>{copy.subtitle}</Text>
        </View>

        <View
          style={[
            styles.mapCard,
            {
              height: mapHeight,
              paddingHorizontal: 0,
              paddingVertical: 0,
              overflow: 'hidden',
            },
          ]}>
          <TrackingMap
            route={tracking.route}
            currentLocation={tracking.currentLocation}
          />

          <View style={styles.mapOverlay}>
            <Text style={styles.mapOverlayText}>Mapa en vivo</Text>
          </View>

          <View style={styles.mapHint}>
            <Text style={styles.mapHintText}>
              {hasLocation
                ? `${tracking.route.length} puntos registrados`
                : 'Esperando GPS'}
            </Text>
          </View>
        </View>

        <View
          style={{
            marginTop: 10,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}>
          <Text
            style={{
              color: '#9CA3AF',
              fontSize: 13,
              textAlign: 'center',
              lineHeight: 18,
            }}>
            {hasLocation
              ? 'La ruta y la posición actual se actualizan en vivo.'
              : 'Activa el GPS o simula una ruta en el emulador para dibujar el recorrido.'}
          </Text>

          {hasLocation && tracking.currentLocation ? (
            <View style={{marginTop: 4, alignItems: 'center', gap: 4}}>
              <Text style={{color: '#E5E7EB', fontSize: 12}}>
                Lat: {formatCoordinate(tracking.currentLocation.latitude)}
              </Text>
              <Text style={{color: '#E5E7EB', fontSize: 12}}>
                Lng: {formatCoordinate(tracking.currentLocation.longitude)}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, {height: statCardHeight}]}>
            <Text style={styles.cardLabel}>Tiempo</Text>
            <Text style={styles.statValue}>{tracking.elapsedLabel}</Text>
          </View>

          <View style={[styles.statCard, {height: statCardHeight}]}>
            <Text style={styles.cardLabel}>Distancia</Text>
            <Text style={styles.statValue}>{tracking.distanceKm} km</Text>
          </View>

          <View style={[styles.statCard, {height: statCardHeight}]}>
            <Text style={styles.cardLabel}>Estado</Text>
            <Text style={styles.statValueSmall}>
              {tracking.status === 'preparing'
                ? 'Buscando GPS...'
                : tracking.status === 'running'
                  ? 'En actividad'
                  : tracking.status === 'paused'
                    ? 'Pausado'
                    : 'Finalizada'}
            </Text>
          </View>

          <View style={[styles.statCard, {height: statCardHeight}]}>
            <Text style={styles.cardLabel}>Velocidad</Text>
            <Text style={styles.statValue}>{tracking.speedKmh} km/h</Text>
          </View>
        </View>

        {tracking.errorMessage ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{tracking.errorMessage}</Text>
          </View>
        ) : null}

        {tracking.status !== 'finished' ? (
          <View style={styles.actionRow}>
            <Pressable
              style={[
                styles.actionButton,
                tracking.status === 'running'
                  ? styles.pauseButton
                  : styles.resumeButton,
              ]}
              onPress={tracking.handlePauseResume}>
              <Text style={styles.actionButtonText}>
                {tracking.status === 'running' ? 'Pausar' : 'Reanudar'}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.actionButton, styles.finishButton]}
              onPress={tracking.handleFinish}>
              <Text style={styles.actionButtonText}>Finalizar</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      <Modal
        visible={tracking.summaryVisible}
        transparent
        animationType="fade"
        onRequestClose={tracking.closeSummary}>
        <View style={styles.summaryBackdrop}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>{tracking.summaryTitle}</Text>

            <View style={styles.summaryMetrics}>
              <View style={styles.summaryMetric}>
                <Text style={styles.summaryLabel}>Tiempo</Text>
                <Text style={styles.summaryValue}>
                  {tracking.summaryData?.time ?? '--:--:--'}
                </Text>
              </View>

              <View style={styles.summaryMetric}>
                <Text style={styles.summaryLabel}>Distancia</Text>
                <Text style={styles.summaryValue}>
                  {tracking.summaryData?.distance ?? '0.00 km'}
                </Text>
              </View>

              <View style={styles.summaryMetric}>
                <Text style={styles.summaryLabel}>Velocidad</Text>
                <Text style={styles.summaryValue}>
                  {tracking.summaryData?.speed ?? '0.0 km/h'}
                </Text>
              </View>
            </View>

            <View style={styles.summaryActions}>
              <Pressable
                style={[styles.summaryButton, styles.summaryButtonSecondary]}
                onPress={tracking.closeSummary}>
                <Text style={styles.summaryButtonSecondaryText}>Cerrar</Text>
              </Pressable>

              <Pressable
                style={[styles.summaryButton, styles.summaryButtonPrimary]}
                onPress={handleBackFromSummary}>
                <Text style={styles.summaryButtonPrimaryText}>Volver</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}