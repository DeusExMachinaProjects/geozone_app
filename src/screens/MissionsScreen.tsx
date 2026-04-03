import React from 'react';
import {Pressable, StatusBar, Text, View} from 'react-native';
import {ScreenContainer} from '../components/ScreenContainer';
import {styles} from '../theme/screens/MissionsScreen.styles';

const missions = [
  {
    title: 'Conquista local',
    description: 'Cierra un circuito de 3 km alrededor de tu zona base.',
    reward: '+120 XP',
    status: 'Activa',
    accent: '#FF6A39',
  },
  {
    title: 'Defensa activa',
    description: 'Vuelve a pasar por tu territorio antes de que expire.',
    reward: '+1 escudo',
    status: 'Urgente',
    accent: '#FFD84D',
  },
  {
    title: 'Expansión urbana',
    description: 'Captura una nueva cuadrícula fuera de tu radio habitual.',
    reward: '+0.40 km²',
    status: 'Nueva',
    accent: '#52E8FF',
  },
];

type MissionCardProps = {
  title: string;
  description: string;
  reward: string;
  status: string;
  accent: string;
};

function MissionCard({
  title,
  description,
  reward,
  status,
  accent,
}: MissionCardProps) {
  return (
    <Pressable style={styles.card}>
      <View style={styles.cardTopRow}>
        <View style={[styles.statusBadge, {borderColor: accent}]}>
          <Text style={[styles.statusBadgeText, {color: accent}]}>{status}</Text>
        </View>

        <Text style={[styles.reward, {color: accent}]}>{reward}</Text>
      </View>

      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>

      <View style={styles.cardBottomRow}>
        <Text style={styles.cardHint}>Recompensa disponible al completar</Text>
        <Text style={styles.cardArrow}>→</Text>
      </View>
    </Pressable>
  );
}

export function MissionsScreen() {
  return (
    <ScreenContainer contentStyle={styles.content}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      <View style={styles.headerBlock}>
        <Text style={styles.eyebrow}>Desafíos activos</Text>
        <Text style={styles.title}>Misiones</Text>
        <Text style={styles.subtitle}>
          Retos personalizados según tu progreso, tu actividad y el territorio
          que estás dominando.
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>3</Text>
          <Text style={styles.summaryLabel}>Activas</Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>1</Text>
          <Text style={styles.summaryLabel}>Urgente</Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>+120</Text>
          <Text style={styles.summaryLabel}>XP base</Text>
        </View>
      </View>

      <View style={styles.list}>
        {missions.map(mission => (
          <MissionCard
            key={mission.title}
            title={mission.title}
            description={mission.description}
            reward={mission.reward}
            status={mission.status}
            accent={mission.accent}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}