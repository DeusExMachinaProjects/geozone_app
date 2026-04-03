import React from 'react';
import {
  Image,
  Pressable,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScreenContainer} from '../components/ScreenContainer';
import {RootStackParamList} from '../navigation/types';
import {styles} from '../theme/screens/OnboardingScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

function FeatureCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <View style={styles.featureCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardText}>{text}</Text>
    </View>
  );
}

export function OnboardingScreen({navigation}: Props) {
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />
      <View style={styles.bottomGlow} />

      <ScreenContainer
        scrool={false}
        backgroundColor="#050505"
        contentStyle={styles.container}>
        <View style={styles.hero}>
          <Image
            source={require('../assets/images/LOGO_2_SF.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />

          <Text style={styles.kicker}>GEOZONE</Text>

          <Text style={styles.title}>
            <Text style={styles.titleGeo}>GEO</Text>
            <Text style={styles.titleZone}>ZONE</Text>
          </Text>

          <Text style={styles.headline}>NO SOLO ENTRENA, CONQUISTA.</Text>

          <Text style={styles.description}>
            GeoZone transforma tu ruta de running o ciclismo en territorio
            dominado. Captura metros cuadrados reales, crea tu comunidad y
            defiende tu zona.
          </Text>
        </View>

        <View style={styles.cardsWrapper}>
          <FeatureCard
            title="Captura por área"
            text="Cada metro cuadrado que cierras en tu recorrido se convierte en tu territorio."
          />

          <FeatureCard
            title="Comunidad activa"
            text="Únete a alianzas, desafía a otros Zoners y recupera zonas perdidas."
          />

          <FeatureCard
            title="Misiones dinámicas"
            text="Retos personalizados basados en tu entorno para que cada salida tenga un objetivo."
          />
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={() => navigation.navigate('Auth')}
            style={({pressed}) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}>
            <Text style={styles.primaryButtonText}>COMENZAR</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    </View>
  );
}