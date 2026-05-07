import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {styles} from '../../../theme/screens/ActivityTrackingScreen.styles';
import {TrackingMap} from './TrackingMap';
import type {UseActivityTrackingResult} from '../hooks/useActivityTracking';

type ActivityType = 'run' | 'ride' | 'pet';

type Props = {
  tracking: UseActivityTrackingResult;
  activityType: ActivityType;
  onBack: () => void;
};

function getActivityLabel(activityType: ActivityType) {
  if (activityType === 'ride') {
    return 'ruta en bicicleta';
  }

  if (activityType === 'pet') {
    return 'paseo';
  }

  return 'carrera';
}

function getActivityTitle(activityType: ActivityType) {
  if (activityType === 'ride') {
    return 'Pedaleo';
  }

  if (activityType === 'pet') {
    return 'Paseo';
  }

  return 'Carrera';
}

function getPrimaryActionLabel(status: UseActivityTrackingResult['status']) {
  if (status === 'preparing') {
    return 'Preparando';
  }

  if (status === 'paused') {
    return 'Reanudar';
  }

  return 'Pausar';
}

function getPrimaryActionIcon(status: UseActivityTrackingResult['status']) {
  if (status === 'preparing') {
    return 'time-outline';
  }

  if (status === 'paused') {
    return 'play';
  }

  return 'pause';
}

function getWeatherText(tracking: UseActivityTrackingResult) {
  if (tracking.weatherLoading) {
    return '-- °C';
  }

  if (!tracking.weather) {
    return '-- °C';
  }

  return `${Math.round(tracking.weather.temperatureC)} °C`;
}

function getWeatherDetail(tracking: UseActivityTrackingResult) {
  if (tracking.weatherLoading) {
    return 'Actualizando';
  }

  if (tracking.weatherError) {
    return 'Sin clima';
  }

  return tracking.weather?.conditionLabel ?? 'Esperando GPS';
}

export function ActivityTrackingView({tracking, activityType, onBack}: Props) {
  const insets = useSafeAreaInsets();
  const {width} = useWindowDimensions();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [confirmFinishVisible, setConfirmFinishVisible] = useState(false);

  const panelWidth = Math.min(Math.max(width * 0.72, 280), 360);
  const slideAnim = useRef(new Animated.Value(panelWidth)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const hasLocation = Boolean(tracking.currentLocation);
  const activityLabel = getActivityLabel(activityType);
  const activityTitle = getActivityTitle(activityType);
  const primaryActionLabel = getPrimaryActionLabel(tracking.status);
  const primaryActionIcon = getPrimaryActionIcon(tracking.status);

  const topOffset = Math.max(insets.top + 12, 28);
  const bottomOffset = Math.max(insets.bottom + 16, 28);

  const normalNotifications = useMemo(
    () => [
      {
        id: 'distance',
        title: 'Distancia actual',
        message: `La sesión acumula ${tracking.distanceKm} km recorridos.`,
        icon: 'navigate-outline',
      },
      {
        id: 'time',
        title: 'Tiempo de actividad',
        message: `Tiempo activo: ${tracking.elapsedLabel}.`,
        icon: 'time-outline',
      },
      {
        id: 'weather',
        title: 'Clima actual',
        message: `${getWeatherText(tracking)} · ${getWeatherDetail(tracking)}.`,
        icon: 'partly-sunny-outline',
      },
      {
        id: 'route',
        title: 'Ruta registrada',
        message: hasLocation
          ? `Se han marcado ${tracking.route.length} puntos en el recorrido.`
          : 'Todavía no hay puntos registrados en el mapa.',
        icon: 'map-outline',
      },
    ],
    [hasLocation, tracking],
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: notificationsOpen ? 0 : panelWidth,
        duration: notificationsOpen ? 260 : 220,
        easing: notificationsOpen ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: notificationsOpen ? 1 : 0,
        duration: notificationsOpen ? 220 : 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [notificationsOpen, overlayOpacity, panelWidth, slideAnim]);

  async function confirmFinish() {
    setConfirmFinishVisible(false);
    await tracking.handleFinish();
  }

  function closeSummaryAndReturn() {
    tracking.closeSummary();
    onBack();
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <TrackingMap
        activityType={activityType}
        route={tracking.route}
        currentLocation={tracking.currentLocation}
      />

      <View style={[styles.topBar, {top: topOffset}]}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={18} color="#FFFFFF" />
          <Text style={styles.backButtonText}>Volver</Text>
        </Pressable>

        <Pressable
          style={styles.notificationButton}
          onPress={() => setNotificationsOpen(true)}>
          <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>2</Text>
          </View>
        </Pressable>
      </View>

      <View style={[styles.metricsRail, {top: topOffset + 58}]}>
        <View style={styles.metricCard}>
          <View style={[styles.metricAccent, styles.metricAccentSpeed]} />
          <Text style={styles.metricLabel}>VELOCIDAD</Text>
          <View style={styles.metricValueRow}>
            <Text style={styles.metricValue}>{tracking.speedKmh}</Text>
            <Text style={styles.metricUnit}>km/h</Text>
          </View>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.metricAccent, styles.metricAccentDistance]} />
          <Text style={styles.metricLabel}>DISTANCIA</Text>
          <View style={styles.metricValueRow}>
            <Text style={styles.metricValue}>{tracking.distanceKm}</Text>
            <Text style={styles.metricUnit}>km</Text>
          </View>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.metricAccent, styles.metricAccentTime]} />
          <Text style={styles.metricLabel}>TIEMPO</Text>
          <Text style={styles.metricValue}>{tracking.elapsedLabel}</Text>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.metricAccent, styles.metricAccentAscent]} />
          <Text style={styles.metricLabel}>ASCENSO</Text>
          <View style={styles.metricValueRow}>
            <Text style={styles.metricValue}>{tracking.ascentLabel}</Text>
            <Text style={styles.metricUnit}>m</Text>
          </View>
        </View>

        <View style={[styles.metricCard, styles.weatherMetricCard]}>
          <View style={[styles.metricAccent, styles.metricAccentWeather]} />
          <Text style={styles.metricLabel}>CLIMA</Text>
          <Text style={styles.weatherMetricValue}>{getWeatherText(tracking)}</Text>
          <Text style={styles.weatherMetricDetail} numberOfLines={1}>
            {getWeatherDetail(tracking)}
          </Text>
        </View>
      </View>

      {tracking.errorMessage ? (
        <View style={styles.floatingWarning}>
          <Ionicons name="alert-circle-outline" size={18} color="#FFFFFF" />
          <Text style={styles.floatingWarningText}>{tracking.errorMessage}</Text>
        </View>
      ) : null}

      {tracking.finishError ? (
        <View style={styles.floatingWarning}>
          <Ionicons name="cloud-upload-outline" size={18} color="#FFFFFF" />
          <Text style={styles.floatingWarningText}>{tracking.finishError}</Text>
        </View>
      ) : null}

      <View style={[styles.bottomControls, {bottom: bottomOffset}]}>
        <Pressable
          disabled={tracking.status === 'preparing' || tracking.finishLoading}
          style={({pressed}) => [
            styles.controlButton,
            styles.pauseButton,
            (pressed || tracking.status === 'preparing') && styles.controlButtonPressed,
          ]}
          onPress={tracking.handlePauseResume}>
          <Ionicons name={primaryActionIcon} size={20} color="#151515" />
          <Text style={styles.pauseButtonText}>{primaryActionLabel}</Text>
        </Pressable>

        <Pressable
          disabled={tracking.finishLoading || tracking.status === 'preparing'}
          style={({pressed}) => [
            styles.controlButton,
            styles.finishButton,
            (pressed || tracking.status === 'preparing') && styles.controlButtonPressed,
          ]}
          onPress={() => setConfirmFinishVisible(true)}>
          <Ionicons name="flag" size={20} color="#FFFFFF" />
          <Text style={styles.finishButtonText}>
            {tracking.finishLoading ? 'Guardando...' : 'Finalizar'}
          </Text>
        </Pressable>
      </View>

      {notificationsOpen ? (
        <View style={styles.notificationLayer} pointerEvents="box-none">
          <Animated.View style={[styles.notificationOverlay, {opacity: overlayOpacity}]}>
            <Pressable
              style={styles.notificationOverlayPressable}
              onPress={() => setNotificationsOpen(false)}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.notificationsPanel,
              {
                width: panelWidth,
                paddingTop: topOffset,
                transform: [{translateX: slideAnim}],
              },
            ]}>
            <View style={styles.notificationsHeader}>
              <View>
                <Text style={styles.notificationsTitle}>Estado</Text>
                <Text style={styles.notificationsSubtitle}>{activityTitle}</Text>
              </View>
              <Pressable
                style={styles.notificationsCloseButton}
                onPress={() => setNotificationsOpen(false)}>
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {normalNotifications.map(item => (
                <View key={item.id} style={styles.notificationItem}>
                  <View style={styles.notificationItemIcon}>
                    <Ionicons name={item.icon as any} size={18} color="#FFFFFF" />
                  </View>
                  <View style={styles.notificationItemContent}>
                    <Text style={styles.notificationItemTitle}>{item.title}</Text>
                    <Text style={styles.notificationItemMessage}>{item.message}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      ) : null}

      <Modal
        transparent
        visible={confirmFinishVisible}
        animationType="fade"
        onRequestClose={() => setConfirmFinishVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.confirmModalCard}>
            <View style={styles.confirmModalIcon}>
              <Ionicons name="flag" size={26} color="#FFFFFF" />
            </View>
            <Text style={styles.confirmModalTitle}>¿Finalizar {activityLabel}?</Text>
            <Text style={styles.confirmModalText}>
              Si confirmas, GeoZone detendrá el GPS, cerrará la notificación en segundo plano y guardará la ruta con sus métricas.
            </Text>

            <View style={styles.confirmModalActions}>
              <Pressable
                style={[styles.confirmModalButton, styles.confirmModalButtonSecondary]}
                onPress={() => setConfirmFinishVisible(false)}>
                <Text style={styles.confirmModalButtonSecondaryText}>No</Text>
              </Pressable>

              <Pressable
                style={[styles.confirmModalButton, styles.confirmModalButtonPrimary]}
                onPress={confirmFinish}>
                <Text style={styles.confirmModalButtonPrimaryText}>Sí, finalizar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={tracking.showSummary}
        animationType="fade"
        onRequestClose={closeSummaryAndReturn}>
        <View style={styles.modalBackdrop}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons name="checkmark" size={28} color="#FFFFFF" />
            </View>
            <Text style={styles.summaryTitle}>{activityTitle} finalizado</Text>
            <Text style={styles.summarySubtitle}>Resumen de tu ruta guardada.</Text>

            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Tiempo</Text>
                <Text style={styles.summaryValue}>{tracking.summary.time}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Distancia</Text>
                <Text style={styles.summaryValue}>{tracking.summary.distance}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Vel. media</Text>
                <Text style={styles.summaryValue}>{tracking.summary.speed}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Ascenso</Text>
                <Text style={styles.summaryValue}>{tracking.summary.ascent}</Text>
              </View>
              <View style={[styles.summaryItem, styles.summaryItemWide]}>
                <Text style={styles.summaryLabel}>Clima</Text>
                <Text style={styles.summaryValue}>{tracking.summary.weather}</Text>
              </View>
            </View>

            <Pressable style={styles.summaryButton} onPress={closeSummaryAndReturn}>
              <Text style={styles.summaryButtonText}>Volver</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
