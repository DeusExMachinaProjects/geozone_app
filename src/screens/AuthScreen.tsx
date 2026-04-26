import React, {useState} from 'react';
import {
  ActivityIndicator,
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
import {useAuth} from '../app/providers/AuthProvider';
import {loginRequest} from '../services/auth/authApi';
import {mapAuthResponseToSession} from '../services/auth/sessionManager';
import {AppAlertModal} from '../components/AppAlertModal';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;
type AuthMode = 'welcome' | 'login';

const eyeOnIcon = require('../components/ui/eye_on.png');
const eyeOffIcon = require('../components/ui/eye_off.png');

export function AuthScreen({navigation}: Props) {
  const [mode, setMode] = useState<AuthMode>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  const {signIn} = useAuth();

  const showDialog = (title: string, message: string) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
  };

  const onCreateAccount = () => {
    navigation.navigate('Register');
  };

  const onGooglePress = () => {
    showDialog('Google', 'Aquí conectaremos el login con Google.');
  };

  const onApplePress = () => {
    showDialog('Apple', 'Aquí conectaremos el login con Apple.');
  };

  const onLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (!normalizedEmail || !normalizedPassword) {
      showDialog(
        'Campos obligatorios',
        'Debes ingresar tu correo y contraseña.',
      );
      return;
    }

    try {
      setIsLoading(true);

      const data = await loginRequest({
        email: normalizedEmail,
        password: normalizedPassword,
      });

      if (data.code !== 0) {
        showDialog(
          'Error de acceso',
          data.msgrsp || 'No fue posible iniciar sesión.',
        );
        return;
      }

      const session = mapAuthResponseToSession(data);
      await signIn(session);
    } catch (error) {
      console.error('Error login:', error);

      const message =
        error instanceof Error
          ? error.message
          : 'No fue posible conectar con la API.';

      showDialog('Error de conexión', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
                  disabled={isLoading}
                  style={({pressed}) => [
                    styles.primaryButton,
                    (pressed || isLoading) && styles.buttonPressed,
                    isLoading && styles.buttonDisabled,
                  ]}>
                  <Text style={styles.primaryButtonText}>CREAR CUENTA</Text>
                </Pressable>

                <Pressable
                  onPress={() => setMode('login')}
                  disabled={isLoading}
                  style={({pressed}) => [
                    styles.secondaryButton,
                    (pressed || isLoading) && styles.buttonPressed,
                    isLoading && styles.buttonDisabled,
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
                    disabled={isLoading}
                    style={({pressed}) => [
                      styles.socialButton,
                      (pressed || isLoading) && styles.buttonPressed,
                      isLoading && styles.buttonDisabled,
                    ]}>
                    <Text style={styles.socialButtonText}>G</Text>
                  </Pressable>

                  <Pressable
                    onPress={onApplePress}
                    disabled={isLoading}
                    style={({pressed}) => [
                      styles.socialButton,
                      (pressed || isLoading) && styles.buttonPressed,
                      isLoading && styles.buttonDisabled,
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
                    autoComplete="email"
                    textContentType="emailAddress"
                    editable={!isLoading}
                  />
                </View>

                <View style={styles.fieldBlock}>
                  <Text style={styles.label}>Contraseña</Text>

                  <View style={styles.passwordInputWrapper}>
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder="********"
                      placeholderTextColor="rgba(255,255,255,0.35)"
                      style={styles.passwordInput}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="password"
                      textContentType="password"
                      editable={!isLoading}
                      returnKeyType="done"
                      onSubmitEditing={onLogin}
                    />

                    <Pressable
                      onPress={() => setShowPassword(prev => !prev)}
                      disabled={isLoading}
                      hitSlop={10}
                      style={styles.passwordToggle}>
                      <Image
                        source={showPassword ? eyeOffIcon : eyeOnIcon}
                        style={{
                          width: 22,
                          height: 22,
                          tintColor: 'rgba(255,255,255,0.72)',
                        }}
                        resizeMode="contain"
                      />
                    </Pressable>
                  </View>
                </View>

                <Pressable
                  onPress={onLogin}
                  disabled={isLoading}
                  style={({pressed}) => [
                    styles.primaryButton,
                    styles.loginPrimaryButton,
                    (pressed || isLoading) && styles.buttonPressed,
                    isLoading && styles.buttonDisabled,
                  ]}>
                  {isLoading ? (
                    <ActivityIndicator color="#0A0A0A" />
                  ) : (
                    <Text style={styles.primaryButtonText}>ENTRAR</Text>
                  )}
                </Pressable>

                <Pressable
                  onPress={() => setMode('welcome')}
                  disabled={isLoading}
                  style={({pressed}) => [
                    styles.secondaryButton,
                    styles.loginSecondaryButton,
                    (pressed || isLoading) && styles.buttonPressed,
                    isLoading && styles.buttonDisabled,
                  ]}>
                  <Text style={styles.secondaryButtonText}>VOLVER</Text>
                </Pressable>
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
      </View>

      <AppAlertModal
        visible={dialogVisible}
        title={dialogTitle}
        message={dialogMessage}
        onClose={closeDialog}
      />
    </>
  );
}