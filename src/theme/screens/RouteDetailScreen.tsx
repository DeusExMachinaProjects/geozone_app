import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {RootStackParamList} from '../navigation/types';
import {TrackingMap} from '../features/tracking/components/TrackingMap';
import {
  getTrackingDetail,
  type TrackingDetailData,
} from '../services/tracking/trackingApi';
import {styles} from '../theme/screens/RouteDetailScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'RouteDetail'>;

function formatDuration(seconds: number) {
  const total = Math.max(0, Math.floor(seconds || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainingSeconds = total % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  return `${remainingSeconds}s`;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  return date.toLocaleString('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getActivityIcon(activityType: string) {
  if (activityType === 'ride') {
    return 'bicycle-outline';
  }

  if (activityType === 'pet') {
    return 'paw-outline';
  }

  return 'walk-outline';
}

function getActivityTitle(data: TrackingDetailData) {
  if (data.activityLabel) {
    return data.activityLabel;
  }

  if (data.tipo) {
    return data.tipo;
  }

  if (data.activityType === 'ride') {
    return 'Bicicleta';
  }

  if (data.activityType === 'pet') {
    return 'Mascota';
  }

  return 'Correr';
}

function DetailMetric({
  icon,
  label,
  value,
  unit,
}: {
  icon: string;
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <View style={styles.metricCard}>
      <View style={styles.metricIcon}>
        <Ionicons name={icon} size={18} color="#FFFFFF" />
      </View>

      <Text style={styles.metricLabel}>{label}</Text>

      <View style={styles.metricValueRow}>
        <Text style={styles.metricValue}>{value}</Text>
        {unit ? <Text style={styles.metricUnit}>{unit}</Text> : null}
      </View>
    </View>
  );
}

export function RouteDetailScreen({navigation, route}: Props) {
  const {idRun} = route.params;

  const [data, setData] = useState<TrackingDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadDetail = useCallback(
    async (mode: 'initial' | 'refresh' = 'initial') => {
      try {
        if (mode === 'initial') {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        setErrorMessage(null);

        const response = await getTrackingDetail(idRun);

        if (response.code !== 0 || !response.data) {
          setErrorMessage(response.msgrsp || 'No se pudo cargar la ruta.');
          return;
        }

        setData(response.data);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'No se pudo cargar la ruta.';

        setErrorMessage(message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [idRun],
  );

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  const mapRoute = useMemo(() => {
    if (!data?.route?.length) {
      return [];
    }

    return data.route
      .filter(
        point =>
          Number.isFinite(Number(point.latitude)) &&
          Number.isFinite(Number(point.longitude)),
      )
      .map(point => ({
        latitude: Number(point.latitude),
        longitude: Number(point.longitude),
        timestamp: point.timestamp ?? null,
        heading: point.heading ?? null,
        speed:
          point.speed !== undefined && point.speed !== null
            ? Number(point.speed)
            : point.speedMps !== undefined && point.speedMps !== null
              ? Number(point.speedMps)
              : null,
      }));
  }, [data?.route]);

  const currentLocation = mapRoute.length ? mapRoute[mapRoute.length - 1] : null;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
        </Pressable>

        <View style={styles.headerTextBlock}>
          <Text style={styles.headerTitle}>Detalle de ruta</Text>
          <Text style={styles.headerSubtitle}>
            Recorrido, clima y métricas de la actividad
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#FF6B52" />
          <Text style={styles.centerStateText}>Cargando ruta...</Text>
        </View>
      ) : errorMessage ? (
        <View style={styles.centerState}>
          <Ionicons name="alert-circle-outline" size={36} color="#FF6B52" />
          <Text style={styles.centerStateTitle}>No se pudo cargar</Text>
          <Text style={styles.centerStateText}>{errorMessage}</Text>

          <Pressable
            style={styles.retryButton}
            onPress={() => loadDetail('initial')}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </Pressable>
        </View>
      ) : data ? (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadDetail('refresh')}
              tintColor="#FF6B52"
            />
          }>
          <View style={styles.mapCard}>
            <TrackingMap
              route={mapRoute}
              currentLocation={currentLocation}
              activityType={data.activityType}
            />
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.activityIcon}>
              <Ionicons
                name={getActivityIcon(data.activityType)}
                size={24}
                color="#FFFFFF"
              />
            </View>

            <View style={styles.summaryTextBlock}>
              <Text style={styles.activityTitle}>{getActivityTitle(data)}</Text>
              <Text style={styles.activityDate}>
                {formatDate(data.startedAt || data.inicio || '')}
              </Text>
            </View>

            <View style={styles.distancePill}>
              <Text style={styles.distancePillValue}>
                {(data.distanceMeters / 1000).toFixed(2)}
              </Text>
              <Text style={styles.distancePillUnit}>km</Text>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            <DetailMetric
              icon="time-outline"
              label="Tiempo"
              value={formatDuration(data.durationSeconds)}
            />

            <DetailMetric
              icon="flame-outline"
              label="Calorías"
              value={String(Math.round(data.calories || 0))}
              unit="kcal"
            />

            <DetailMetric
              icon="speedometer-outline"
              label="Vel. media"
              value={(data.speedAvgKmh || 0).toFixed(1)}
              unit="km/h"
            />

            <DetailMetric
              icon="flash-outline"
              label="Vel. máxima"
              value={(data.speedMaxKmh || 0).toFixed(1)}
              unit="km/h"
            />

            <DetailMetric
              icon="trending-up-outline"
              label="Ascenso"
              value={(data.ascentMeters || 0).toFixed(0)}
              unit="m"
            />

            <DetailMetric
              icon="thermometer-outline"
              label="Temperatura"
              value={
                data.weather?.temperatureC !== null &&
                data.weather?.temperatureC !== undefined
                  ? Math.round(data.weather.temperatureC).toString()
                  : '--'
              }
              unit="°C"
            />
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Clima durante la ruta</Text>

            <View style={styles.weatherRow}>
              <View style={styles.weatherMainIcon}>
                <Ionicons name="partly-sunny-outline" size={28} color="#FFFFFF" />
              </View>

              <View style={styles.weatherTextBlock}>
                <Text style={styles.weatherTitle}>
                  {data.weather?.conditionLabel || 'Sin información de clima'}
                </Text>

                <Text style={styles.weatherSubtitle}>
                  Humedad:{' '}
                  {data.weather?.humidityPercent !== null &&
                  data.weather?.humidityPercent !== undefined
                    ? `${Math.round(data.weather.humidityPercent)}%`
                    : '--'}{' '}
                  · Viento:{' '}
                  {data.weather?.windSpeedKmh !== null &&
                  data.weather?.windSpeedKmh !== undefined
                    ? `${data.weather.windSpeedKmh.toFixed(1)} km/h`
                    : '--'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Datos técnicos</Text>

            <View style={styles.techRow}>
              <Text style={styles.techLabel}>ID actividad</Text>
              <Text style={styles.techValue}>#{data.idRun}</Text>
            </View>

            <View style={styles.techRow}>
              <Text style={styles.techLabel}>ID ruta</Text>
              <Text style={styles.techValue}>#{data.idRuta}</Text>
            </View>

            <View style={styles.techRow}>
              <Text style={styles.techLabel}>Puntos GPS</Text>
              <Text style={styles.techValue}>{mapRoute.length}</Text>
            </View>

            <View style={styles.techRow}>
              <Text style={styles.techLabel}>Finalizada</Text>
              <Text style={styles.techValue}>
                {formatDate(data.finishedAt || data.fin || '')}
              </Text>
            </View>
          </View>
        </ScrollView>
      ) : null}
    </View>
  );
}