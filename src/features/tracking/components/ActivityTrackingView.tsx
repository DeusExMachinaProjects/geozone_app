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

type Props = {
  tracking: UseActivityTrackingResult;
  activityType: 'run' | 'ride' | 'pet';
  onBack: () => void;
};

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  icon: string;
  unread?: boolean;
};

type ImportantNotification = {
  id: string;
  title: string;
  message: string;
  badge: string;
  icon: string;
  tone: 'warning' | 'danger';
};

function getActivityLabel(activityType: 'run' | 'ride' | 'pet') {
  if (activityType === 'ride') {
    return 'pedaleo';
  }

  if (activityType === 'pet') {
    return 'paseo';
  }

  return 'carrera';
}

function getActivityTitle(activityType: 'run' | 'ride' | 'pet') {
  if (activityType === 'ride') {
    return 'Pedaleo';
  }

  if (activityType === 'pet') {
    return 'Paseo';
  }

  return 'Carrera';
}

function getRouteIcon(activityType: 'run' | 'ride' | 'pet') {
  if (activityType === 'ride') {
    return 'bicycle-outline';
  }

  if (activityType === 'pet') {
    return 'paw-outline';
  }

  return 'walk-outline';
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

function splitMetricValue(value: string | number) {
  const raw = String(value ?? '').trim();
  const match = raw.match(/^([-+]?\d+(?:[.,]\d+)?)(?:\s*(.*))?$/);

  if (!match) {
    return {value: raw || '0', unit: ''};
  }

  return {
    value: match[1],
    unit: (match[2] ?? '').trim(),
  };
}

export function ActivityTrackingView({
  tracking,
  activityType,
  onBack,
}: Props) {
  const insets = useSafeAreaInsets();
  const {width} = useWindowDimensions();

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const panelWidth = Math.min(Math.max(width * 0.72, 280), 360);
  const slideAnim = useRef(new Animated.Value(panelWidth)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const hasLocation = Boolean(tracking.currentLocation);
  const activityLabel = getActivityLabel(activityType);
  const activityTitle = getActivityTitle(activityType);
  const primaryActionLabel = getPrimaryActionLabel(tracking.status);
  const primaryActionIcon = getPrimaryActionIcon(tracking.status);
  const speedMetric = splitMetricValue(tracking.speedKmh);
  const distanceMetric = splitMetricValue(tracking.distanceKm);
  const ascentMetric = splitMetricValue(tracking.ascentLabel);

  const importantNotifications = useMemo<ImportantNotification[]>(() => {
    const items: ImportantNotification[] = [];

    if (tracking.errorMessage) {
      items.push({
        id: 'tracking-error',
        title: 'Aviso importante',
        message: tracking.errorMessage,
        badge: 'IMPORTANTE',
        icon: 'alert-circle-outline',
        tone: 'danger',
      });
    } else if (!hasLocation && tracking.status === 'preparing') {
      items.push({
        id: 'gps-waiting',
        title: 'Esperando señal GPS',
        message: `Aún no llega una ubicación válida para comenzar a registrar la ${activityLabel}.`,
        badge: 'GPS',
        icon: 'location-outline',
        tone: 'warning',
      });
    }

    return items;
  }, [activityLabel, hasLocation, tracking.errorMessage, tracking.status]);

  const activeImportantNotification =
    importantNotifications.length > 0 ? importantNotifications[0] : null;

  const normalNotifications = useMemo<NotificationItem[]>(() => {
    return [
      {
        id: 'distance',
        title: 'Distancia actual',
        message: `La sesión acumula ${tracking.distanceKm} km recorridos.`,
        time: 'En vivo',
        icon: 'navigate-outline',
        unread: true,
      },
      {
        id: 'time',
        title: 'Tiempo de actividad',
        message: `Tiempo activo: ${tracking.elapsedLabel}.`,
        time: 'En vivo',
        icon: 'time-outline',
      },
      {
        id: 'ascent',
        title: 'Ascenso acumulado',
        message: `Ascenso positivo acumulado: ${tracking.ascentLabel} m.`,
        time: 'En vivo',
        icon: 'trending-up-outline',
      },
      {
        id: 'state',
        title:
          tracking.status === 'paused'
            ? `${activityTitle} en pausa`
            : tracking.status === 'running'
              ? `${activityTitle} en curso`
              : tracking.status === 'preparing'
                ? 'Inicializando seguimiento'
                : 'Sesión finalizada',
        message:
          tracking.status === 'paused'
            ? 'Puedes reanudar cuando quieras desde el botón inferior.'
            : tracking.status === 'running'
              ? `Velocidad actual: ${tracking.speedKmh} km/h.`
              : tracking.status === 'preparing'
                ? `El sistema está preparando el seguimiento de la ${activityLabel}.`
                : 'El recorrido terminó y está listo para resumen.',
        time: 'Sistema',
        icon:
          tracking.status === 'paused'
            ? 'pause-circle-outline'
            : tracking.status === 'running'
              ? 'radio-outline'
              : tracking.status === 'preparing'
                ? 'compass-outline'
                : 'flag-outline',
        unread: tracking.status === 'running',
      },
      {
        id: 'route',
        title: 'Ruta registrada',
        message: hasLocation
          ? `Se han marcado ${tracking.route.length} puntos en el recorrido.`
          : 'Todavía no hay puntos registrados en el mapa.',
        time: 'Mapa',
        icon: getRouteIcon(activityType),
      },
    ];
  }, [
    activityLabel,
    activityTitle,
    activityType,
    hasLocation,
    tracking.ascentLabel,
    tracking.distanceKm,
    tracking.elapsedLabel,
    tracking.route.length,
    tracking.speedKmh,
    tracking.status,
  ]);

  const unreadCount = normalNotifications.filter(item => item.unread).length;

  useEffect(() => {
    if (!notificationsOpen) {
      slideAnim.setValue(panelWidth);
    }
  }, [notificationsOpen, panelWidth, slideAnim]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: notificationsOpen ? 0 : panelWidth,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: notificationsOpen ? 1 : 0,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [notificationsOpen, overlayOpacity, panelWidth, slideAnim]);

  const openNotifications = () => {
    setNotificationsOpen(true);
  };

  const closeNotifications = () => {
    setNotificationsOpen(false);
  };

  const handlePrimaryAction = () => {
    if (tracking.status === 'preparing') {
      return;
    }

    tracking.handlePauseResume();
  };

  const handleCloseSummary = () => {
    if (typeof tracking.closeSummary === 'function') {
      tracking.closeSummary();
    }
  };

  const handleBackFromSummary = () => {
    handleCloseSummary();
    onBack();
  };

  const actionBottom = Math.max(insets.bottom + 18, 22);
  const importantBottom = actionBottom + 88;

  const primaryButtonStyle =
    tracking.status === 'paused'
      ? styles.resumeButton
      : tracking.status === 'preparing'
        ? styles.disabledActionButton
        : styles.pauseButton;

  const primaryButtonTextStyle =
    tracking.status === 'paused'
      ? styles.resumeButtonText
      : tracking.status === 'preparing'
        ? styles.disabledActionButtonText
        : styles.pauseButtonText;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      <View style={styles.mapStage}>
        <TrackingMap
          activityType={activityType}
          route={tracking.route}
          currentLocation={tracking.currentLocation}
        />

        <View style={styles.mapTint} pointerEvents="none" />

        <View style={[styles.topRow, {top: insets.top + 12}]}>
          <Pressable style={styles.backButtonFloating} onPress={onBack}>
            <Ionicons
              name="chevron-back"
              size={17}
              color="#FFFFFF"
              style={styles.backButtonIcon}
            />
            <Text style={styles.backButtonText}>Volver</Text>
          </Pressable>

          <Pressable style={styles.bellButton} onPress={openNotifications}>
            <Ionicons name="notifications-outline" size={21} color="#FFFFFF" />

            {unreadCount > 0 ? (
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            ) : null}
          </Pressable>
        </View>

        <View style={[styles.statsRail, {top: insets.top + 76}]}>
          <View style={styles.statPill}>
            <View style={[styles.statAccent, styles.speedAccent]} />
            <Text style={styles.statPillLabel}>VELOCIDAD</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.statPillValue}>{speedMetric.value}</Text>
              <Text style={styles.statPillUnit}>
                {speedMetric.unit || 'km/h'}
              </Text>
            </View>
          </View>

          <View style={styles.statPill}>
            <View style={[styles.statAccent, styles.distanceAccent]} />
            <Text style={styles.statPillLabel}>DISTANCIA</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.statPillValue}>{distanceMetric.value}</Text>
              <Text style={styles.statPillUnit}>
                {distanceMetric.unit || 'km'}
              </Text>
            </View>
          </View>

          <View style={styles.statPill}>
            <View style={[styles.statAccent, styles.timeAccent]} />
            <Text style={styles.statPillLabel}>TIEMPO</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.statPillValue}>{tracking.elapsedLabel}</Text>
            </View>
          </View>

          <View style={styles.statPill}>
            <View style={[styles.statAccent, styles.ascentAccent]} />
            <Text style={styles.statPillLabel}>ASCENSO</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.statPillValue}>{ascentMetric.value}</Text>
              <Text style={styles.statPillUnit}>{ascentMetric.unit || 'm'}</Text>
            </View>
          </View>

          <View style={[styles.statPill, styles.weatherPill]}>
            <View style={[styles.statAccent, styles.weatherAccent]} />
            <Text style={styles.statPillLabel}>CLIMA</Text>

            {tracking.weatherLoading && !tracking.weather ? (
              <View style={styles.statValueRow}>
                <Text style={styles.statPillValue}>--</Text>
                <Text style={styles.statPillUnit}>°C</Text>
              </View>
            ) : tracking.weather ? (
              <>
                <View style={styles.statValueRow}>
                  <Text style={styles.statPillValue}>
                    {Math.round(tracking.weather.temperatureC)}
                  </Text>
                  <Text style={styles.statPillUnit}>°C</Text>
                </View>
                <Text style={styles.statMiniText} numberOfLines={2}>
                  {tracking.weather.conditionLabel}
                </Text>
              </>
            ) : (
              <Text style={styles.statMiniText}>Sin clima</Text>
            )}
          </View>
        </View>

        {activeImportantNotification ? (
          <View
            style={[
              styles.importantNotificationCard,
              activeImportantNotification.tone === 'danger'
                ? styles.importantNotificationDanger
                : styles.importantNotificationWarning,
              {bottom: importantBottom},
            ]}>
            <View style={styles.importantNotificationHeader}>
              <View style={styles.importantNotificationTitleWrap}>
                <View style={styles.importantNotificationIconWrap}>
                  <Ionicons
                    name={activeImportantNotification.icon}
                    size={16}
                    color="#FFFFFF"
                  />
                </View>

                <Text style={styles.importantNotificationTitle}>
                  {activeImportantNotification.title}
                </Text>
              </View>

              <View
                style={[
                  styles.importantNotificationBadge,
                  activeImportantNotification.tone === 'danger'
                    ? styles.importantNotificationBadgeDanger
                    : styles.importantNotificationBadgeWarning,
                ]}>
                <Text style={styles.importantNotificationBadgeText}>
                  {activeImportantNotification.badge}
                </Text>
              </View>
            </View>

            <Text style={styles.importantNotificationMessage}>
              {activeImportantNotification.message}
            </Text>
          </View>
        ) : null}

        {tracking.status !== 'finished' ? (
          <View style={[styles.actionRowFloating, {bottom: actionBottom}]}>
            <Pressable
              style={[styles.actionButton, primaryButtonStyle]}
              onPress={handlePrimaryAction}
              disabled={tracking.status === 'preparing'}>
              <View style={styles.actionButtonContent}>
                <Ionicons
                  name={primaryActionIcon}
                  size={19}
                  color={
                    tracking.status === 'running'
                      ? '#111111'
                      : tracking.status === 'preparing'
                        ? '#D1D5DB'
                        : '#FFFFFF'
                  }
                  style={styles.actionButtonIcon}
                />
                <Text style={[styles.actionButtonText, primaryButtonTextStyle]}>
                  {primaryActionLabel}
                </Text>
              </View>
            </Pressable>

            <Pressable
              style={[styles.actionButton, styles.finishButton]}
              onPress={tracking.handleFinish}>
              <View style={styles.actionButtonContent}>
                <Ionicons
                  name="square-outline"
                  size={17}
                  color="#FFFFFF"
                  style={styles.actionButtonIcon}
                />
                <Text style={[styles.actionButtonText, styles.finishButtonText]}>
                  Finalizar
                </Text>
              </View>
            </Pressable>
          </View>
        ) : null}
      </View>

      <Animated.View
        pointerEvents={notificationsOpen ? 'auto' : 'none'}
        style={[styles.notificationsOverlay, {opacity: overlayOpacity}]}>
        <Pressable
          style={styles.notificationsOverlayTouch}
          onPress={closeNotifications}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.notificationsPanel,
          {
            width: panelWidth,
            paddingTop: insets.top + 14,
            paddingBottom: Math.max(insets.bottom + 16, 18),
            transform: [{translateX: slideAnim}],
          },
        ]}>
        <View style={styles.notificationsHandle} />

        <View style={styles.notificationsHeader}>
          <View>
            <Text style={styles.notificationsTitle}>Notificaciones</Text>
            <Text style={styles.notificationsSubtitle}>
              Mensajes normales del seguimiento
            </Text>
          </View>

          <Pressable
            style={styles.notificationsCloseButton}
            onPress={closeNotifications}>
            <Ionicons name="close-outline" size={22} color="#FFFFFF" />
          </Pressable>
        </View>

        <ScrollView
          style={styles.notificationsScroll}
          showsVerticalScrollIndicator={false}>
          {normalNotifications.map(item => (
            <View key={item.id} style={styles.notificationItem}>
              <View style={styles.notificationIconWrap}>
                <Ionicons name={item.icon} size={18} color="#FF6B52" />
              </View>

              <View style={styles.notificationTextWrap}>
                <View style={styles.notificationTitleRow}>
                  <Text style={styles.notificationItemTitle}>{item.title}</Text>
                  <Text style={styles.notificationItemTime}>{item.time}</Text>
                </View>

                <Text style={styles.notificationItemMessage}>
                  {item.message}
                </Text>
              </View>

              {item.unread ? <View style={styles.notificationUnreadDot} /> : null}
            </View>
          ))}
        </ScrollView>
      </Animated.View>

      <Modal
        visible={tracking.summaryVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseSummary}>
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

              <View style={styles.summaryMetric}>
                <Text style={styles.summaryLabel}>Ascenso</Text>
                <Text style={styles.summaryValue}>
                  {tracking.summaryData?.ascent ?? '0 m'}
                </Text>
              </View>
            </View>

            <View style={styles.summaryActions}>
              <Pressable
                style={[styles.summaryButton, styles.summaryButtonSecondary]}
                onPress={handleCloseSummary}>
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