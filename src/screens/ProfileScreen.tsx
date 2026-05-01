import React from 'react';
import {Pressable, StatusBar, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenContainer} from '../components/ScreenContainer';
import {AvatarSummaryCard} from '../features/avatar/components/AvatarSummaryCard';
import {RootStackParamList} from '../navigation/types';
import {styles} from '../theme/screens/ProfileScreen.styles';

type ProfileNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type StatCardProps = {
  value: string;
  label: string;
};

function StatCard({value, label}: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export function ProfileScreen() {
  const navigation = useNavigation<ProfileNavigationProp>();

  return (
    <ScreenContainer contentStyle={styles.content}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      <Pressable
        onPress={() => navigation.navigate('DashboardMetas')}
        style={({pressed}) => [
          styles.dashboardButton,
          pressed && styles.dashboardButtonPressed,
        ]}>
        <View style={styles.dashboardButtonIcon}>
          <Ionicons name="analytics-outline" size={22} color="#FFFFFF" />
        </View>

        <View style={styles.dashboardButtonTextBlock}>
          <Text style={styles.dashboardButtonTitle}>Dashboard Metas</Text>
          <Text style={styles.dashboardButtonSubtitle}>
            Salud, calorías, peso, kilómetros y esfuerzo
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
      </Pressable>

      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>CU</Text>
        </View>

        <View style={styles.levelBadge}>
          <Text style={styles.levelBadgeText}>Lv 15</Text>
        </View>

        <Text style={styles.name}>Christopher Ulloa</Text>
        <Text style={styles.username}>@christopher.zone</Text>
        <Text style={styles.tag}>Zoner · Runner / Cyclist</Text>

        <View style={styles.pillsRow}>
          <View style={styles.infoPill}>
            <Text style={styles.infoPillText}>4 días seguidos</Text>
          </View>

          <View style={styles.infoPill}>
            <Text style={styles.infoPillText}>⚡ Oro</Text>
          </View>
        </View>
      </View>

      <AvatarSummaryCard />

      <View style={styles.statsRow}>
        <StatCard value="5" label="Actividades" />
        <StatCard value="31.8" label="Km" />
        <StatCard value="1.7" label="Km²" />
      </View>

      <View style={styles.mainCard}>
        <Text style={styles.cardTitle}>Resumen semanal</Text>
        <Text style={styles.cardText}>
          5 actividades · 31.8 km recorridos · 1.7 km² capturados
        </Text>

        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progreso semanal</Text>
          <Text style={styles.progressPercent}>72%</Text>
        </View>

        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Objetivo próximo</Text>
        <Text style={styles.cardText}>
          Alcanzar nivel 8 y desbloquear modo de defensa avanzada.
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Estado territorial</Text>
        <Text style={styles.cardText}>
          Tu zona principal sigue bajo control. Hay actividad rival en el sector
          poniente.
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Amigos</Text>
        <Text style={styles.cardText}>
          Acá administra tus amigos, agrega nuevos contactos y envía desafíos
          para competir por zonas y recompensas.
        </Text>

        <View style={styles.friendsActionsRow}>
          <View style={styles.friendActionBox}>
            <Text style={styles.friendActionValue}>+</Text>
            <Text style={styles.friendActionLabel}>Agregar Nuevo amigo</Text>
          </View>

          <View style={styles.friendActionBox}>
            <Text style={styles.friendActionValue}>✉</Text>
            <Text style={styles.friendActionLabel}>Desafío Enviar reto</Text>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}