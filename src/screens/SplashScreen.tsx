import React, {useEffect} from 'react';
import {Image, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScreenContainer} from '../components/ScreenContainer';
import {RootStackParamList} from '../navigation/types';
import {styles} from '../theme/screens/SplashScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({navigation}: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 1400);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ScreenContainer
      scroll={false}
      backgroundColor="#050505"
      contentStyle={styles.container}>
      <View style={styles.logoWrapper}>
        <Image
          source={require('../assets/images/LOGO_2_SF.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>
        <Text style={styles.titleGeo}>GEO</Text>
        <Text style={styles.titleZone}>ZONE</Text>
      </Text>

      <Text style={styles.subtitle}>No solo entrena, conquista.</Text>
    </ScreenContainer>
  );
}