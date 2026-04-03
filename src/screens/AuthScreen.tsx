import React, {useState} from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {styles} from '../theme/screens/AuthScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

type AuthMode = 'welcome' | 'login';

export function AuthScreen({navigation}: Props) {
  const [mode, setMode] = useState<AuthMode>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = () => {
    navigation.replace('MainTabs');
  };

  const onCreateAccount = () => {
    navigation.navigate('Register');
  };

  const onGooglePress = () => {
    Alert.alert('Google', 'Aquí conectaremos el login con Google.');
  };

  const onApplePress = () => {
    Alert.alert('Apple', 'Aquí conectaremos el login con Apple.');
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />
      <View style={styles.bottomGlow} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {mode === 'welcome' ? (
          <View style={styles.welcomeWrapper}>
            <View style={styles.topBlock}>
              <Image
                source={require('../assets/images/LOGO_2_SF.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />

              <Text style={styles.brandTitle}>
                <Text style={styles.brandTitleGeo}>GEO</Text>
                <Text style={styles.brandTitleZone}>ZONE</Text>
              </Text>
              <Text style={styles.brandSubtitle}>
                NO SOLO ENTRENA, CONQUISTA
              </Text>
            </View>

            <View style={styles.middleBlock}>
              <Pressable
                onPress={onCreateAccount}
                style={({pressed}) => [
                  styles.primaryButton,
                  pressed && styles.buttonPressed,
                ]}>
                <Text style={styles.primaryButtonText}>CREAR CUENTA</Text>
              </Pressable>

              <Pressable
                onPress={() => setMode('login')}
                style={({pressed}) => [
                  styles.secondaryButton,
                  pressed && styles.buttonPressed,
                ]}>
                <Text style={styles.secondaryButtonText}>INICIAR SESIÓN</Text>
              </Pressable>
            </View>

            <View style={styles.bottomBlock}>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>O CONTINÚA CON</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialRow}>
                <Pressable
                  onPress={onGooglePress}
                  style={({pressed}) => [
                    styles.socialButton,
                    pressed && styles.buttonPressed,
                  ]}>
                  <Text style={styles.socialButtonText}>G</Text>
                </Pressable>

                <Pressable
                  onPress={onApplePress}
                  style={({pressed}) => [
                    styles.socialButton,
                    pressed && styles.buttonPressed,
                  ]}>
                  <Image
                    source={require('../assets/images/social_apple_mac_.png')}
                    style={styles.socialIconImage}
                    resizeMode="contain"
                  />
                </Pressable>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.loginWrapper}>
            <View style={styles.loginHeader}>
              <Image
                source={require('../assets/images/LOGO_2_SF.png')}
                style={styles.logoImageSmall}
                resizeMode="contain"
              />

              <Text style={styles.loginTitle}>INICIAR SESIÓN</Text>
              <Text style={styles.loginSubtitle}>
                Accede a tu cuenta GeoZone para continuar.
              </Text>
            </View>

            <View style={styles.formCard}>
              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Correo</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="tu@email.com"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="********"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  style={styles.input}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <Pressable
                onPress={onLogin}
                style={({pressed}) => [
                  styles.primaryButton,
                  styles.loginPrimaryButton,
                  pressed && styles.buttonPressed,
                ]}>
                <Text style={styles.primaryButtonText}>ENTRAR</Text>
              </Pressable>

              <Pressable
                onPress={() => setMode('welcome')}
                style={({pressed}) => [
                  styles.secondaryButton,
                  styles.loginSecondaryButton,
                  pressed && styles.buttonPressed,
                ]}>
                <Text style={styles.secondaryButtonText}>VOLVER</Text>
              </Pressable>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}