import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Modal,
  Pressable,
  StatusBar,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Camera,
  CircleLayer,
  LineLayer,
  MapView,
  ShapeSource,
} from '@maplibre/maplibre-react-native';
import {styles} from '../../../theme/screens/ActivityTrackingScreen.styles';
import type {ActivityType} from '../types';
import type {UseActivityTrackingResult} from '../hooks/useActivityTracking';

type Props = {
  activityType: ActivityType;
  tracking: UseActivityTrackingResult;
  onBack: () => void;
};

const DEFAULT_COORDINATE = {
  latitude: -33.4489,
  longitude: -70.6693,
};

const DEFAULT_ZOOM = 15.5;

const MAP_STYLE: any = {
  version: 8,
  name: 'GeoZone OSM Raster',
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'osm-base',
      type: 'raster',
      source: 'osm',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
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

export function ActivityTrackingView({
  activityType,
  tracking,
  onBack,
}: Props) {
  const insets = useSafeAreaInsets();
  const {height} = useWindowDimensions();
  const cameraRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const copy = getCopy(activityType);
  const mapHeight = Math.max(210, Math.min(270, height * 0.29));
  const statCardHeight = height < 760 ? 82 : 90;

  const lineShape = useMemo(() => {
    if (tracking.route.length < 2) {
      return null;
    }

    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: tracking.route.map(point => [point.longitude, point.latitude]),
      },
    };
  }, [tracking.route]);

  const pointShape = useMemo(() => {
    if (!tracking.currentLocation) {
      return null;
    }

    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [
          tracking.currentLocation.longitude,
          tracking.currentLocation.latitude,
        ],
      },
    };
  }, [tracking.currentLocation]);

  useEffect(() => {
    if (!tracking.currentLocation) {
      return;
    }

    cameraRef.current?.setCamera({
      centerCoordinate: [
        tracking.currentLocation.longitude,
        tracking.currentLocation.latitude,
      ],
      zoomLevel: DEFAULT_ZOOM,
      animationDuration: 700,
    });
  }, [tracking.currentLocation]);

  const handleBackFromSummary = () => {
    tracking.closeSummary();
    onBack();
  };

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

        <View style={[styles.mapCard, {height: mapHeight}]}>
          <MapView
            style={styles.map}
            mapStyle={MAP_STYLE}
            compassEnabled
            rotateEnabled
            pitchEnabled
            zoomEnabled
            attributionEnabled
            logoEnabled={false}
            onDidFinishLoadingStyle={() => setIsMapLoaded(true)}
            onDidFailLoadingMap={() => setIsMapLoaded(false)}>
            <Camera
              ref={cameraRef}
              defaultSettings={{
                centerCoordinate: [
                  DEFAULT_COORDINATE.longitude,
                  DEFAULT_COORDINATE.latitude,
                ],
                zoomLevel: DEFAULT_ZOOM,
              }}
            />

            {lineShape ? (
              <ShapeSource id={`${activityType}-route-source`} shape={lineShape}>
                <LineLayer
                  id={`${activityType}-route-line`}
                  style={{
                    lineColor: '#FF6B52',
                    lineWidth: 5,
                    lineCap: 'round',
                    lineJoin: 'round',
                  }}
                />
              </ShapeSource>
            ) : null}

            {pointShape ? (
              <ShapeSource id={`${activityType}-point-source`} shape={pointShape}>
                <CircleLayer
                  id={`${activityType}-point-outer`}
                  style={{
                    circleRadius: 9,
                    circleColor: '#FFFFFF',
                    circleOpacity: 0.95,
                  }}
                />
                <CircleLayer
                  id={`${activityType}-point-inner`}
                  style={{
                    circleRadius: 5,
                    circleColor: '#2563EB',
                  }}
                />
              </ShapeSource>
            ) : null}
          </MapView>

          {!isMapLoaded ? (
            <View style={styles.mapOverlay}>
              <Text style={styles.mapOverlayText}>Cargando mapa…</Text>
            </View>
          ) : null}

          {!tracking.currentLocation ? (
            <View style={styles.mapHint}>
              <Text style={styles.mapHintText}>Esperando ubicación…</Text>
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