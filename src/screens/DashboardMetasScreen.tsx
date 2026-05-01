import React, {useMemo} from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {useAuth} from '../app/providers/AuthProvider';
import {styles} from '../theme/screens/DashboardMetasScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'DashboardMetas'>;

type MetricCardProps = {
  icon: string;
  label: string;
  value: string;
  detail: string;
  tone?: 'orange' | 'gold' | 'blue' | 'green' | 'red';
};

function toNumber(value: unknown): number | null {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function calculateAge(fecNacimiento?: string | null) {
  if (!fecNacimiento) {
    return null;
  }

  const birthDate = new Date(`${fecNacimiento}T00:00:00`);

  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age;
}

function calculateBmi(weightKg: number | null, heightCm: number | null) {
  if (!weightKg || !heightCm) {
    return null;
  }

  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

function getBmiLabel(bmi: number | null) {
  if (!bmi) {
    return 'Sin datos';
  }

  if (bmi < 18.5) {
    return 'Bajo peso';
  }

  if (bmi < 25) {
    return 'Normal';
  }

  if (bmi < 30) {
    return 'Sobrepeso';
  }

  return 'Obesidad';
}

function getEstimatedCaloriesLabel(weightKg: number | null) {
  if (!weightKg) {
    return 'Sin peso registrado';
  }

  /**
   * Estimación temporal visual.
   * Luego debe venir del historial real de actividades.
   */
  const estimatedKm = 31.8;
  const estimatedHours = 4.2;
  const averageMet = 7.5;
  const calories = Math.round(averageMet * weightKg * estimatedHours);

  return `${calories.toLocaleString('es-CL')} kcal`;
}

function MetricCard({
  icon,
  label,
  value,
  detail,
  tone = 'orange',
}: MetricCardProps) {
  return (
    <View style={styles.metricCard}>
      <View style={[styles.metricIcon, styles[`metricIcon_${tone}`]]}>
        <Ionicons name={icon} size={20} color="#FFFFFF" />
      </View>

      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricDetail}>{detail}</Text>
    </View>
  );
}

export function DashboardMetasScreen({navigation}: Props) {
  const {session} = useAuth();
  const user = session?.user;

  const pesoKg = toNumber(user?.PESO_KG);
  const alturaCm = toNumber(user?.ALTURA_CM);
  const pesoObjetivoKg = toNumber(user?.PESO_OBJETIVO_KG);
  const edad = calculateAge(user?.FEC_NACIMIENTO);

  const bmi = useMemo(() => calculateBmi(pesoKg, alturaCm), [pesoKg, alturaCm]);

  const pesoPendiente = useMemo(() => {
    if (!pesoKg || !pesoObjetivoKg) {
      return null;
    }

    return pesoKg - pesoObjetivoKg;
  }, [pesoKg, pesoObjetivoKg]);

  const progressPercent = useMemo(() => {
    if (!pesoKg || !pesoObjetivoKg) {
      return 0;
    }

    const diff = Math.abs(pesoKg - pesoObjetivoKg);

    if (diff === 0) {
      return 100;
    }

    /**
     * Temporal hasta tener PESO_INICIAL_KG real.
     * Con historial real, esto debe salir de TB_USUARIO_PESO_HISTORIAL.
     */
    const estimatedInitialDiff = Math.max(diff + 4, 1);
    return Math.min(100, Math.round(((estimatedInitialDiff - diff) / estimatedInitialDiff) * 100));
  }, [pesoKg, pesoObjetivoKg]);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </Pressable>

          <View style={styles.headerTextBlock}>
            <Text style={styles.kicker}>GeoZone Health</Text>
            <Text style={styles.title}>Dashboard Metas</Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons name="analytics-outline" size={22} color="#FF6B52" />
          </View>
        </View>

        <View style={styles.heroCard}>
          <View>
            <Text style={styles.heroLabel}>Estado actual</Text>
            <Text style={styles.heroValue}>
              {pesoKg ? `${pesoKg.toFixed(1)} kg` : '-- kg'}
            </Text>
            <Text style={styles.heroDetail}>
              {pesoObjetivoKg
                ? `Meta: ${pesoObjetivoKg.toFixed(1)} kg`
                : 'Agrega peso objetivo para calcular avance'}
            </Text>
          </View>

          <View style={styles.circleProgress}>
            <Text style={styles.circleProgressValue}>{progressPercent}%</Text>
            <Text style={styles.circleProgressLabel}>meta</Text>
          </View>
        </View>

        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.sectionTitle}>Progreso corporal</Text>
            <Text style={styles.sectionBadge}>Estimado</Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, {width: `${progressPercent}%`}]} />
          </View>

          <Text style={styles.goalText}>
            {pesoPendiente === null
              ? 'Para calcular avance real falta registrar peso objetivo e historial de peso.'
              : pesoPendiente > 0
                ? `Te faltan aproximadamente ${pesoPendiente.toFixed(
                    1,
                  )} kg para llegar a tu meta.`
                : `Ya estás en tu peso objetivo o por debajo de la meta configurada.`}
          </Text>
        </View>

        <View style={styles.metricsGrid}>
          <MetricCard
            icon="body-outline"
            label="IMC"
            value={bmi ? bmi.toFixed(1) : '--'}
            detail={getBmiLabel(bmi)}
            tone="orange"
          />

          <MetricCard
            icon="flame-outline"
            label="Calorías"
            value={getEstimatedCaloriesLabel(pesoKg)}
            detail="Estimación semanal"
            tone="red"
          />

          <MetricCard
            icon="walk-outline"
            label="Kilómetros"
            value="31.8 km"
            detail="Total semanal temporal"
            tone="blue"
          />

          <MetricCard
            icon="trending-up-outline"
            label="Ascenso"
            value="1.240 m"
            detail="Subida acumulada"
            tone="green"
          />

          <MetricCard
            icon="speedometer-outline"
            label="Esfuerzo"
            value="Medio"
            detail="Según ritmo y duración"
            tone="gold"
          />

          <MetricCard
            icon="calendar-outline"
            label="Edad"
            value={edad ? `${edad}` : '--'}
            detail="Usada para métricas"
            tone="blue"
          />
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons name="information-circle-outline" size={22} color="#FFB703" />
          </View>

          <View style={styles.infoTextBlock}>
            <Text style={styles.infoTitle}>Precisión de calorías</Text>
            <Text style={styles.infoText}>
              Sin frecuencia cardíaca, las calorías deben mostrarse como una
              estimación. GeoZone puede mejorar el cálculo usando peso, ritmo,
              pendiente, duración y clima, pero no debe venderlo como exacto.
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons name="cloud-outline" size={22} color="#59C3C3" />
          </View>

          <View style={styles.infoTextBlock}>
            <Text style={styles.infoTitle}>Clima y esfuerzo</Text>
            <Text style={styles.infoText}>
              La temperatura, lluvia, humedad y viento se pueden usar como factor
              de ajuste para calorías. Esto ayuda, pero el dato más importante
              seguirá siendo el peso del usuario y el historial real de rutas.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}