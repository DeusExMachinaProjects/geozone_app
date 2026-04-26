import React, {useCallback, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AvatarPreview} from './AvatarPreview';
import {loadAvatarConfig} from '../storage';
import {
  AvatarConfig,
  DEFAULT_AVATAR_CONFIG,
} from '../types';
import {RootStackParamList} from '../../../navigation/types';

type AvatarSummaryNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Avatar'
>;

export function AvatarSummaryCard() {
  const navigation = useNavigation<AvatarSummaryNavigationProp>();
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(
    DEFAULT_AVATAR_CONFIG,
  );

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      async function syncAvatar() {
        const saved = await loadAvatarConfig();

        if (!mounted) {
          return;
        }

        setAvatarConfig(saved);
      }

      syncAvatar();

      return () => {
        mounted = false;
      };
    }, []),
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Avatar</Text>
      <Text style={styles.subtitle}>
        Personaliza tu estilo y accesorios para GeoZone.
      </Text>

      <View style={styles.previewWrap}>
        <AvatarPreview config={avatarConfig} size={112} />
      </View>

      <Pressable
        onPress={() => navigation.navigate('Avatar')}
        style={({pressed}) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}>
        <Text style={styles.buttonText}>Editar avatar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 22,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 18,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.66)',
    fontSize: 14,
    lineHeight: 21,
  },
  previewWrap: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 14,
    minHeight: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B52',
  },
  buttonPressed: {
    opacity: 0.92,
    transform: [{scale: 0.995}],
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});