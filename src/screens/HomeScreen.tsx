import React, {useState} from 'react';
import {Pressable, StatusBar, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenContainer} from '../components/ScreenContainer';
import {NotificationsPanel} from '../components/NotificationsPanel';
import {styles} from '../theme/screens/HomeScreen.styles';
import {RootStackParamList} from '../navigation/types';

type StatItemProps = {
  value: string;
  label: string;
};

type ActionCardProps = {
  icon: string;
  title: string;
  accent: string;
  onPress: () => void;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

function StatItem({value, label}: StatItemProps) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ActionCard({icon, title, accent, onPress}: ActionCardProps) {
  return (
    <Pressable style={styles.actionCard} onPress={onPress}>
      <Text style={[styles.actionIcon, {color: accent}]}>{icon}</Text>
      <Text style={styles.actionTitle}>{title}</Text>
    </Pressable>
  );
}

export function HomeScreen() {
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <>
      <ScreenContainer scroll={false} contentStyle={styles.content}>
        <StatusBar barStyle="light-content" backgroundColor="#050505" />

        <View style={styles.headerRow}>
          <View style={styles.profileBlock}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>J</Text>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.welcome}>Bienvenido, Jean</Text>
              <Text style={styles.location}>@SpeedJean - Santiago</Text>

              <View style={styles.badgesRow}>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>Lv 15</Text>
                </View>

                <View style={styles.miniBadge}>
                  <Text style={styles.miniBadgeText}>⚡ Oro</Text>
                </View>

                <View style={styles.miniBadge}>
                  <Text style={styles.miniBadgeText}>🔥 4 días consecutivos</Text>
                </View>
              </View>
            </View>
          </View>

          <Pressable
            style={styles.notificationButton}
            onPress={() => setNotificationsVisible(true)}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </Pressable>
        </View>

        <View style={styles.statsCard}>
          <StatItem value="12" label="Zonas" />
          <StatItem value="41" label="Amigos" />
          <StatItem value="#03" label="Rank" />
          <StatItem value="169 km" label="Distancia Total" />
        </View>

        <View style={styles.rankCard}>
          <View style={styles.rankTopRow}>
            <View style={styles.rankLevelBadge}>
              <Text style={styles.rankLevelBadgeText}>Lv. 15</Text>
            </View>

            <Text style={styles.rankTitle}>Dominador Urbano</Text>
          </View>

          <Text style={styles.xpLeft}>3200 XP</Text>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          <View style={styles.progressLabels}>
            <Text style={styles.progressHint}>3200 XP faltan para Lv. 16</Text>
            <Text style={styles.progressMax}>5000 XP</Text>
          </View>
        </View>

        <View style={styles.actionsGrid}>
          <ActionCard
            icon="🏃"
            title="A CORRER!"
            accent="#78E35E"
            onPress={() => navigation.navigate('Run')}
          />

          <ActionCard
            icon="🐾"
            title="MASCOTAS"
            accent="#FF3E38"
            onPress={() => navigation.navigate('Pet')}
          />

          <ActionCard
            icon="⚙️"
            title="Opciones"
            accent="#52E8FF"
            onPress={() => navigation.navigate('Options')}
          />

          <ActionCard
            icon="🏁"
            title="MISIONES"
            accent="#FFD84D"
            onPress={() => navigation.navigate('Missions')}
          />
        </View>
      </ScreenContainer>

      <NotificationsPanel
        visible={notificationsVisible}
        onClose={() => setNotificationsVisible(false)}
      />
    </>
  );
}