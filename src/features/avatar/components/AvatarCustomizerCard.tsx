import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  ACCESSORY_OPTIONS,
  AvatarConfig,
  BODY_TYPE_OPTIONS,
  BOTTOM_OPTIONS,
  DEFAULT_AVATAR_CONFIG,
  TOP_OPTIONS,
} from '../types';
import {loadAvatarConfig, saveAvatarConfig} from '../storage';
import {AvatarPreview} from './AvatarPreview';
import {AvatarOptionSelector} from './AvatarOptionSelector';
import {AvatarColorPicker} from './AvatarColorPicker';

export function AvatarCustomizerCard() {
  const [avatar, setAvatar] = useState<AvatarConfig>(DEFAULT_AVATAR_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const savedAvatar = await loadAvatarConfig();

      if (!mounted) {
        return;
      }

      setAvatar(savedAvatar);
      setIsLoading(false);
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!saveMessage) {
      return;
    }

    const timeout = setTimeout(() => {
      setSaveMessage('');
    }, 1800);

    return () => clearTimeout(timeout);
  }, [saveMessage]);

  async function handleSave() {
    try {
      setIsSaving(true);
      await saveAvatarConfig(avatar);
      setSaveMessage('Avatar guardado');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el avatar.');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.card}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color="#FF6B52" />
          <Text style={styles.loadingText}>Cargando avatar...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.previewBox}>
        <AvatarPreview config={avatar} size={220} />
      </View>

      <AvatarOptionSelector
        title="Tipo de avatar"
        value={avatar.bodyType}
        options={BODY_TYPE_OPTIONS}
        onChange={bodyType => setAvatar(prev => ({...prev, bodyType}))}
      />

      <AvatarOptionSelector
        title="Accesorio"
        value={avatar.accessory}
        options={ACCESSORY_OPTIONS}
        onChange={accessory => setAvatar(prev => ({...prev, accessory}))}
      />

      <AvatarOptionSelector
        title="Parte superior"
        value={avatar.top}
        options={TOP_OPTIONS}
        onChange={top => setAvatar(prev => ({...prev, top}))}
      />

      <AvatarOptionSelector
        title="Parte inferior"
        value={avatar.bottom}
        options={BOTTOM_OPTIONS}
        onChange={bottom => setAvatar(prev => ({...prev, bottom}))}
      />

      <AvatarColorPicker
        title="Color superior"
        value={avatar.topColor}
        onChange={topColor => setAvatar(prev => ({...prev, topColor}))}
      />

      <AvatarColorPicker
        title="Color inferior"
        value={avatar.bottomColor}
        onChange={bottomColor => setAvatar(prev => ({...prev, bottomColor}))}
      />

      <AvatarColorPicker
        title="Color accesorio"
        value={avatar.accessoryColor}
        onChange={accessoryColor =>
          setAvatar(prev => ({...prev, accessoryColor}))
        }
      />

      <Pressable
        disabled={isSaving}
        onPress={handleSave}
        style={({pressed}) => [
          styles.saveButton,
          pressed && !isSaving && styles.saveButtonPressed,
          isSaving && styles.saveButtonDisabled,
        ]}>
        <Text style={styles.saveButtonText}>
          {isSaving ? 'Guardando...' : 'Guardar avatar'}
        </Text>
      </Pressable>

      {saveMessage ? <Text style={styles.savedText}>{saveMessage}</Text> : null}
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
  previewBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    marginTop: 22,
    minHeight: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B52',
  },
  saveButtonPressed: {
    opacity: 0.92,
    transform: [{scale: 0.995}],
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  savedText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#FFB199',
    fontSize: 13,
    fontWeight: '700',
  },
  loadingBox: {
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: 'rgba(255,255,255,0.72)',
    fontSize: 14,
  },
});