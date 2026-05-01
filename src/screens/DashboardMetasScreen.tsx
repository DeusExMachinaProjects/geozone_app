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
import {
  getDashboardMetas,
  type DashboardMetasData,
} from '../services/dashboard/dashboardApi';
import {styles} from '../theme/screens/DashboardMetasScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'DashboardMetas'>;

function formatDuration(seconds: number) {
  const total = Math.max(0, Math.floor(seconds || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

function MetricCard({
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

export function DashboardMetasScreen({navigation}: Props) {
  const [data, setData] = useState<DashboardMetasData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadDashboard = useCallback(async (mode: 'initial' | 'refresh' = 'initial') => {
    try {
      if (mode === 'initial') {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setErrorMessage(null);

      const response = await getDashboardMetas();

      if (response.code !== 0 || !response.data) {
        setErrorMessage(response.msgrsp || 'No se pudo cargar el dashboard.');
        return;
      }

      setData(response.data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo cargar el dashboard.';

      setErrorMessage(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const progressPercent = useMemo(() => {
    return data?.weight.targetProgressPercent ?? 0;
  }, [data?.weight.targetProgressPercent]);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
        </Pressable>

        <View style={styles.headerTextBlock}>
          <Text style={styles.headerTitle}>Dashboard Metas</Text>
          <Text style={styles.headerSubtitle}>
            Salud, calorías, peso, kilómetros y esfuerzo
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#FF6B52" />
          <Text style={styles.centerStateText}>Cargando métricas...</Text>
        </View>
      ) : errorMessage ? (
        <View style={styles.centerState}>
          <Ionicons name="alert-circle-outline" size={34} color="#FF6B52" />
          <Text style={styles.centerStateTitle}>No se pudo cargar</Text>
          <Text style={styles.centerStateText}>{errorMessage}</Text>

          <Pressable
            style={styles.retryButton}
            onPress={() => loadDashboard('initial')}>
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
              onRefresh={() => loadDashboard('refresh')}
              tintColor="#FF6B52"
            />
          }>
          <View style={styles.heroCard}>
            <View style={styles.heroTextBlock}>
              <Text style={styles.heroOverline}>Progreso corporal</Text>
              <Text style={styles.heroTitle}>
                {data.weight.weightLostKg > 0
                  ? `${data.weight.weightLostKg.toFixed(1)} kg menos`
                  : 'Comienza tu progreso'}
              </Text>
              <Text style={styles.heroSubtitle}>
                Peso actual:{' '}
                {data.weight.currentWeightKg
                  ? `${data.weight.currentWeightKg.toFixed(1)} kg`
                  : 'sin registro'}
              </Text>
            </View>

            <View style={styles.progressCircle}>
              <Text style={styles.progressCircleValue}>
                {Math.round(progressPercent)}%
              </Text>
              <Text style={styles.progressCircleLabel}>meta</Text>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            <MetricCard
              icon="flame-outline"
              label="Calorías"
              value={String(data.totals.totalCalories)}
              unit="kcal"
            />
            <MetricCard
              icon="map-outline"
              label="Kilómetros"
              value={data.totals.totalDistanceKm.toFixed(1)}
              unit="km"
            />
            <MetricCard
              icon="time-outline"
              label="Tiempo"
              value={formatDuration(data.totals.totalDurationSeconds)}
            />
            <MetricCard
              icon="trending-up-outline"
              label="Ascenso"
              value={data.totals.totalAscentM.toFixed(0)}
              unit="m"
            />
            <MetricCard
              icon="speedometer-outline"
              label="Vel. media"
              value={data.totals.avgSpeedKmh.toFixed(1)}
              unit="km/h"
            />
            <MetricCard
              icon="heart-outline"
              label="IMC"
              value={data.user.imc ? data.user.imc.toFixed(1) : '--'}
            />
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Peso y objetivo</Text>

            <View style={styles.weightRow}>
              <View style={styles.weightItem}>
                <Text style={styles.weightLabel}>Inicial</Text>
                <Text style={styles.weightValue}>
                  {data.weight.initialWeightKg
                    ? `${data.weight.initialWeightKg.toFixed(1)} kg`
                    : '--'}
                </Text>
              </View>

              <View style={styles.weightItem}>
                <Text style={styles.weightLabel}>Actual</Text>
                <Text style={styles.weightValue}>
                  {data.weight.currentWeightKg
                    ? `${data.weight.currentWeightKg.toFixed(1)} kg`
                    : '--'}
                </Text>
              </View>

              <View style={styles.weightItem}>
                <Text style={styles.weightLabel}>Meta</Text>
                <Text style={styles.weightValue}>
                  {data.weight.targetWeightKg
                    ? `${data.weight.targetWeightKg.toFixed(1)} kg`
                    : '--'}
                </Text>
              </View>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {width: `${Math.min(100, Math.max(0, progressPercent))}%`},
                ]}
              />
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Actividades por tipo</Text>

            {data.byType.length ? (
              data.byType.map(item => (
                <View key={item.type} style={styles.typeRow}>
                  <View>
                    <Text style={styles.typeTitle}>{item.type}</Text>
                    <Text style={styles.typeSubtitle}>
                      {item.totalActivities} actividades · {item.distanceKm.toFixed(1)} km
                    </Text>
                  </View>

                  <Text style={styles.typeCalories}>{item.calories} kcal</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>
                Todavía no tienes actividades guardadas.
              </Text>
            )}
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Últimas rutas</Text>

            {data.recentActivities.length ? (
              data.recentActivities.map(item => (
                <View key={item.idRun} style={styles.recentRow}>
                  <View style={styles.recentIcon}>
                    <Ionicons name="navigate-outline" size={17} color="#FFFFFF" />
                  </View>

                  <View style={styles.recentTextBlock}>
                    <Text style={styles.recentTitle}>
                      {item.tipo} · {item.distanceKm.toFixed(2)} km
                    </Text>
                    <Text style={styles.recentSubtitle}>
                      {formatDuration(item.durationSeconds)} · {item.calories} kcal ·{' '}
                      {item.temperatureC !== null
                        ? `${Math.round(item.temperatureC)}°C`
                        : 'sin clima'}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>
                Cuando finalices una actividad aparecerá aquí.
              </Text>
            )}
          </View>
        </ScrollView>
      ) : null}
    </View>
  );
}