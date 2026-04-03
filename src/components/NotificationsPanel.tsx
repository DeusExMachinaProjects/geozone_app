import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from '../theme/screens/NotificationsPanel.styles';

type Props = {
  visible: boolean;
  onClose: () => void;
};

type NotificationCardProps = {
  category: string;
  title: string;
  description: string;
  time: string;
  accent: string;
};

const notifications = [
  {
    id: '1',
    category: 'Próximo recorrido',
    title: 'Ruta Costanera 10K',
    description:
      'Tienes un recorrido sugerido para mañana a primera hora en tu zona principal.',
    time: 'Mañana · 07:00',
    accent: '#52E8FF',
  },
  {
    id: '2',
    category: 'Misión diaria',
    title: 'Conquista 2 sectores nuevos',
    description:
      'Completa tu misión diaria y suma experiencia extra antes de que termine el día.',
    time: 'Disponible hoy',
    accent: '#FF6A39',
  },
  {
    id: '3',
    category: 'Evento disponible',
    title: 'Sprint Urbano de Fin de Semana',
    description:
      'Únete al evento comunitario y compite por recompensas especiales y posición en el ranking.',
    time: 'Sábado · 09:30',
    accent: '#FFD84D',
  },
  {
    id: '4',
    category: 'Misión diaria',
    title: 'Defiende tu zona base',
    description:
      'Pasa nuevamente por tu territorio principal para evitar que pierda estabilidad.',
    time: 'Expira en 4 h',
    accent: '#78E35E',
  },
];

function NotificationCard({
  category,
  title,
  description,
  time,
  accent,
}: NotificationCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <View style={[styles.badge, {borderColor: accent}]}>
          <Text style={[styles.badgeText, {color: accent}]}>{category}</Text>
        </View>

        <Text style={[styles.cardTime, {color: accent}]}>{time}</Text>
      </View>

      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>

      <View style={styles.cardFooter}>
        <Text style={styles.cardFooterText}>Ver detalle</Text>
        <Text style={[styles.cardFooterArrow, {color: accent}]}>→</Text>
      </View>
    </View>
  );
}

export function NotificationsPanel({visible, onClose}: Props) {
  const [mounted, setMounted] = useState(visible);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const panelTranslateY = useRef(new Animated.Value(36)).current;
  const panelOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);

      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(panelTranslateY, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(panelOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();

      return;
    }

    if (mounted) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(panelTranslateY, {
          toValue: 30,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(panelOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setMounted(false);
      });
    }
  }, [visible, mounted, backdropOpacity, panelTranslateY, panelOpacity]);

  if (!mounted) {
    return null;
  }

  return (
    <Modal
      transparent
      visible={mounted}
      statusBarTranslucent
      onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Animated.View style={[styles.backdrop, {opacity: backdropOpacity}]}>
          <Pressable style={styles.backdropPressable} onPress={onClose} />
        </Animated.View>

        <SafeAreaView style={styles.safeArea}>
          <Animated.View
            style={[
              styles.panel,
              {
                opacity: panelOpacity,
                transform: [{translateY: panelTranslateY}],
              },
            ]}>
            <View style={styles.header}>
              <View style={styles.headerTextBlock}>
                <Text style={styles.eyebrow}>Centro de actividad</Text>
                <Text style={styles.title}>Notificaciones</Text>
                <Text style={styles.subtitle}>
                  Próximos recorridos, misiones diarias y eventos disponibles.
                </Text>
              </View>

              <Pressable style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.highlightCard}>
              <Text style={styles.highlightTitle}>Tienes 4 novedades activas</Text>
              <Text style={styles.highlightText}>
                Revisa tus recorridos sugeridos, acepta desafíos diarios y entra
                a los eventos antes de que expiren.
              </Text>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}>
              {notifications.map(item => (
                <NotificationCard
                  key={item.id}
                  category={item.category}
                  title={item.title}
                  description={item.description}
                  time={item.time}
                  accent={item.accent}
                />
              ))}
            </ScrollView>
          </Animated.View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}