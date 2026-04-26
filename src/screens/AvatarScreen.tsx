import React from 'react';
import {Pressable, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenContainer} from '../components/ScreenContainer';
import {AvatarCustomizerCard} from '../features/avatar/components/AvatarCustomizerCard';
import {RootStackParamList} from '../navigation/types';

type AvatarScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Avatar'
>;

export function AvatarScreen() {
  const navigation = useNavigation<AvatarScreenNavigationProp>();

  return (
    <ScreenContainer scroll contentStyle={styles.content}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      <Pressable
        onPress={() => navigation.goBack()}
        style={({pressed}) => [
          styles.backButton,
          pressed && styles.backButtonPressed,
        ]}>
        <Text style={styles.backIcon}>←</Text>
        <Text style={styles.backText}>Volver</Text>
      </Pressable>

      <View style={styles.heroCard}>
        <Text style={styles.title}>Avatar</Text>
        <Text style={styles.subtitle}>
          Personaliza tu look para GeoZone. Aquí podrás cambiar tu estilo,
          colores y accesorios.
        </Text>
      </View>

      <AvatarCustomizerCard />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 34,
  },
  backButton: {
    alignSelf: 'flex-start',
    minHeight: 42,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  backButtonPressed: {
    opacity: 0.9,
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginRight: 8,
    lineHeight: 20,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  heroCard: {
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 18,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.68)',
    fontSize: 14,
    lineHeight: 21,
  },
});