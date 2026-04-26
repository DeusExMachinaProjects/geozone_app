import React from 'react';
import {ActivityIndicator, Image, StatusBar, Text, View} from 'react-native';
import {styles} from '../theme/screens/SplashScreen.styles';

export function SplashScreen() {
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      <View style={styles.content}>
        <Image
          source={require('../assets/images/LOGO_2_SF.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.brandTitle}>
          <Text style={styles.brandTitleGeo}>GEO</Text>
          <Text style={styles.brandTitleZone}>ZONE</Text>
        </Text>

        <Text style={styles.subtitle}>NO SOLO ENTRENA, CONQUISTA</Text>

        <View style={styles.loaderWrapper}>
          <ActivityIndicator size="small" color="#ff5b0a" />
        </View>
      </View>
    </View>
  );
}