import React, {useMemo, useState} from 'react';
import {Pressable, StatusBar, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenContainer} from '../components/ScreenContainer';
import {NotificationsPanel} from '../components/NotificationsPanel';
import {styles} from '../theme/screens/HomeScreen.styles';
import {RootStackParamList} from '../navigation/types';
import {useAuth} from '../app/providers/AuthProvider';

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
  const {session} = useAuth();

  const displayName = useMemo(() => {
    return (
      session?.user.NICK?.trim() ||
      session?.user.NOMBRE?.trim() ||
      'Zonner'
    );
  }, [session]);

  const secondaryIdentity = useMemo(() => {
    const nick = session?.user.NICK?.trim();

    if (nick) {
      return `@${nick}`;
    }

    return session?.user.EMAIL ?? '@geozone';
  }, [session]);

  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <>
      <ScreenContainer scroll={false} contentStyle={styles.content}>
        <StatusBar barStyle="light-content" backgroundColor="#050505" />

        <View style={styles.headerRow}>
          <View style={styles.profileBlock}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{avatarLetter}</Text>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.welcome}>Bienvenido, {displayName}</Text>
              <Text style={styles.location}>{secondaryIdentity}</Text>

              <View style={styles.badgesRow}>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>Lv 1</Text>
                </View>

                <View style={styles.miniBadge}>
                  <Text style={styles.miniBadgeText}>🌍 Nuevo Zonner</Text>
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
          <StatItem value="0" label="Zonas" />
          <StatItem value="0" label="Amigos" />
          <StatItem value="#--" label="Rank" />
          <StatItem value="0 km" label="Distancia Total" />
        </View>

        <View style={styles.rankCard}>
          <View style={styles.rankTopRow}>
            <View style={styles.rankLevelBadge}>
              <Text style={styles.rankLevelBadgeText}>Lv. 1</Text>
            </View>

            <Text style={styles.rankTitle}>Recién llegado</Text>
          </View>

          <Text style={styles.xpLeft}>0 XP</Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, {width: '4%'}]} />
          </View>

          <View style={styles.progressLabels}>
            <Text style={styles.progressHint}>
              Completa tus primeras rutas para subir de nivel
            </Text>
            <Text style={styles.progressMax}>100 XP</Text>
          </View>
        </View>

        <View style={styles.actionsGrid}>
          <ActionCard
            icon="🏃"
            title="CORRER"
            accent="#78E35E"
            onPress={() => navigation.navigate('Run')}
          />

          <ActionCard
            icon="🚴"
            title="BICICLETA"
            accent="#FF3E38"
            onPress={() => navigation.navigate('Ride')}
          />

          <ActionCard
            icon="🐾"
            title="MASCOTAS"
            accent="#FF6B52"
            onPress={() => navigation.navigate('Pet')}
          />

          <ActionCard
            icon="⚙️"
            title="OPCIONES"
            accent="#52E8FF"
            onPress={() => navigation.navigate('Options')}
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