import React from 'react';
import {StatusBar, Text, View} from 'react-native';
import {ScreenContainer} from '../components/ScreenContainer';
import {AvatarSummaryCard} from '../features/avatar/components/AvatarSummaryCard';
import {styles} from '../theme/screens/ProfileScreen.styles';

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
  return (
    <ScreenContainer scroll contentStyle={styles.content}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

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
            <Text style={styles.infoPillText}>🔥 4 días seguidos</Text>
          </View>

          <View style={styles.infoPill}>
            <Text style={styles.infoPillText}>⚡ Oro</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatCard value="27" label="Misiones" />
        <StatCard value="14" label="Zonas" />
        <StatCard value="4" label="Alianzas" />
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

      <AvatarSummaryCard />

      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Amigos</Text>
        <Text style={styles.cardText}>
          Acá administra tus amigos, agrega nuevos contactos y envía desafíos
          para competir por zonas y recompensas.
        </Text>

        <View style={styles.friendsActionsRow}>
          <View style={styles.friendActionBox}>
            <Text style={styles.friendActionValue}>+ Agregar</Text>
            <Text style={styles.friendActionLabel}>Nuevo amigo</Text>
          </View>

          <View style={styles.friendActionBox}>
            <Text style={styles.friendActionValue}>✉ Desafío</Text>
            <Text style={styles.friendActionLabel}>Enviar reto</Text>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}