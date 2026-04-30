import React, {useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {styles} from '../theme/screens/RegisterScreen.styles';
import {registerRequest} from '../services/auth/authApi';
import {mapAuthResponseToSession} from '../services/auth/sessionManager';
import {useAuth} from '../app/providers/AuthProvider';
import {AppAlertModal} from '../components/AppAlertModal';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;
type RegisterStep = 0 | 1 | 2 | 3 | 4 | 5;
type GenderValue = 'M' | 'F' | 'O' | '';

const TOTAL_STEPS = 6;

const eyeOnIcon = require('../components/ui/eye_on.png');
const eyeOffIcon = require('../components/ui/eye_off.png');

function formatBirthDateInput(value: string) {
  const digits = value.replace(/[^\d]/g, '').slice(0, 8);

  if (digits.length <= 4) {
    return digits;
  }

  if (digits.length <= 6) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }

  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidBirthDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [yearText, monthText, dayText] = value.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (!year || !month || !day) {
    return false;
  }

  const date = new Date(year, month - 1, day);

  const isRealDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  if (!isRealDate) {
    return false;
  }

  const today = new Date();
  const minYear = today.getFullYear() - 100;
  const maxYear = today.getFullYear() - 10;

  return year >= minYear && year <= maxYear;
}

function normalizeDecimalInput(value: string) {
  const normalized = value.replace(',', '.').replace(/[^\d.]/g, '');
  const parts = normalized.split('.');

  if (parts.length <= 2) {
    return normalized;
  }

  return `${parts[0]}.${parts.slice(1).join('')}`;
}

function parsePositiveNumber(value: string) {
  const normalized = value.replace(',', '.').trim();

  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

export function RegisterScreen({navigation}: Props) {
  const {signIn} = useAuth();

  const [step, setStep] = useState<RegisterStep>(0);
  const [isLoading, setIsLoading] = useState(false);

  const [viewportHeight, setViewportHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [nick, setNick] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fecNacimiento, setFecNacimiento] = useState('');
  const [genero, setGenero] = useState<GenderValue>('');

  const [pesoKg, setPesoKg] = useState('');
  const [alturaCm, setAlturaCm] = useState('');
  const [pesoObjetivoKg, setPesoObjetivoKg] = useState('');

  const progress = useMemo(() => `Paso ${step + 1}/${TOTAL_STEPS}`, [step]);
  const shouldScroll = contentHeight > viewportHeight + 8;

  const showDialog = (title: string, message: string) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogVisible(true);
  };

  const validateStep = () => {
    if (step === 0) {
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPassword = password.trim();
      const normalizedConfirm = passwordConfirm.trim();

      if (!normalizedEmail || !normalizedPassword || !normalizedConfirm) {
        showDialog(
          'Campos obligatorios',
          'Debes ingresar correo, contraseña y confirmación.',
        );
        return false;
      }

      if (!isValidEmail(normalizedEmail)) {
        showDialog('Correo inválido', 'Ingresa un correo válido.');
        return false;
      }

      if (normalizedPassword.length < 6) {
        showDialog(
          'Contraseña inválida',
          'La contraseña debe tener al menos 6 caracteres.',
        );
        return false;
      }

      if (normalizedPassword !== normalizedConfirm) {
        showDialog(
          'Contraseñas distintas',
          'La confirmación no coincide con la contraseña.',
        );
        return false;
      }

      return true;
    }

    if (step === 1) {
      if (!nick.trim() || !nombre.trim()) {
        showDialog(
          'Campos obligatorios',
          'Debes ingresar tu nick y tu nombre.',
        );
        return false;
      }

      if (nick.trim().length > 12) {
        showDialog(
          'Nick demasiado largo',
          'El nick puede tener como máximo 12 caracteres.',
        );
        return false;
      }

      return true;
    }

    if (step === 2) {
      if (!apellido.trim() || !fecNacimiento.trim()) {
        showDialog(
          'Campos obligatorios',
          'Debes ingresar tu apellido y tu fecha de nacimiento.',
        );
        return false;
      }

      if (!isValidBirthDate(fecNacimiento.trim())) {
        showDialog(
          'Fecha inválida',
          'Usa el formato YYYY-MM-DD. Ejemplo: 1998-01-20. Debes tener al menos 10 años.',
        );
        return false;
      }

      return true;
    }

    if (step === 3) {
      if (!genero) {
        showDialog('Falta selección', 'Debes escoger tu género.');
        return false;
      }

      return true;
    }

    if (step === 4) {
      const parsedPesoKg = parsePositiveNumber(pesoKg);
      const parsedAlturaCm = parsePositiveNumber(alturaCm);
      const parsedPesoObjetivoKg = parsePositiveNumber(pesoObjetivoKg);

      if (!parsedPesoKg || !parsedAlturaCm) {
        showDialog(
          'Datos físicos obligatorios',
          'Debes ingresar tu peso actual y tu altura para generar estadísticas reales.',
        );

        return false;
      }

      if (parsedPesoKg < 30 || parsedPesoKg > 300) {
        showDialog(
          'Peso fuera de rango',
          'Ingresa un peso válido entre 30 y 300 kg.',
        );

        return false;
      }

      if (parsedAlturaCm < 100 || parsedAlturaCm > 230) {
        showDialog(
          'Altura fuera de rango',
          'Ingresa una altura válida entre 100 y 230 cm.',
        );

        return false;
      }

      if (
        pesoObjetivoKg.trim() &&
        (!parsedPesoObjetivoKg ||
          parsedPesoObjetivoKg < 30 ||
          parsedPesoObjetivoKg > 300)
      ) {
        showDialog(
          'Peso objetivo inválido',
          'Si ingresas un peso objetivo, debe estar entre 30 y 300 kg.',
        );

        return false;
      }

      return true;
    }

    return true;
  };

  const onBack = () => {
    if (isLoading) {
      return;
    }

    if (step === 0) {
      navigation.goBack();
      return;
    }

    setStep(prev => (prev - 1) as RegisterStep);
  };

  const onContinue = async () => {
    if (!validateStep()) {
      return;
    }

    if (step < 5) {
      setStep(prev => (prev + 1) as RegisterStep);
      return;
    }

    try {
      setIsLoading(true);

      const parsedPesoKg = parsePositiveNumber(pesoKg);
      const parsedAlturaCm = parsePositiveNumber(alturaCm);
      const parsedPesoObjetivoKg = parsePositiveNumber(pesoObjetivoKg);

      if (!parsedPesoKg || !parsedAlturaCm) {
        showDialog(
          'Datos físicos obligatorios',
          'Debes ingresar tu peso actual y tu altura.',
        );
        return;
      }

      const response = await registerRequest({
        email: email.trim().toLowerCase(),
        password: password.trim(),
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        fecNacimiento: fecNacimiento.trim(),
        genero: genero as 'M' | 'F' | 'O',
        nick: nick.trim(),
        subscrito: false,
        pesoKg: parsedPesoKg,
        alturaCm: parsedAlturaCm,
        pesoObjetivoKg: parsedPesoObjetivoKg,
      });

      if (response.code !== 0) {
        showDialog(
          'No fue posible crear la cuenta',
          response.msgrsp || 'Ocurrió un problema durante el registro.',
        );
        return;
      }

      const session = mapAuthResponseToSession(response);
      await signIn(session);
    } catch (error) {
      console.error('register error:', error);

      const message =
        error instanceof Error
          ? error.message
          : 'No fue posible conectar con la API.';

      showDialog('Error de conexión', message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep0 = () => (
    <>
      <Text style={styles.stepTitle}>Crea tu acceso</Text>
      <Text style={styles.stepSubtitle}>
        Empecemos con tu correo y contraseña para entrar a GeoZone.
      </Text>

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
          editable={!isLoading}
        />
      </View>

      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.passwordInputWrapper}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
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

      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Confirmar contraseña</Text>
        <View style={styles.passwordInputWrapper}>
          <TextInput
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            placeholder="Repite tu contraseña"
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.passwordInput}
            secureTextEntry={!showPasswordConfirm}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />
          <Pressable
            onPress={() => setShowPasswordConfirm(prev => !prev)}
            disabled={isLoading}
            hitSlop={10}
            style={styles.passwordToggle}>
            <Image
              source={showPasswordConfirm ? eyeOffIcon : eyeOnIcon}
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
    </>
  );

  const renderStep1 = () => (
    <>
      <Text style={styles.stepTitle}>¿Cómo te encontrarán?</Text>
      <Text style={styles.stepSubtitle}>
        De esta forma tus amigos o Zonners te encontrarán.
      </Text>

      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Nombre / Nick</Text>
        <TextInput
          value={nick}
          onChangeText={setNick}
          placeholder="Morningstar"
          placeholderTextColor="rgba(255,255,255,0.35)"
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
          maxLength={12}
        />
        <Text style={styles.helper}>Máximo 12 caracteres.</Text>
      </View>

      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          value={nombre}
          onChangeText={setNombre}
          placeholder="Christopher"
          placeholderTextColor="rgba(255,255,255,0.35)"
          style={styles.input}
          autoCapitalize="words"
          autoCorrect={false}
          editable={!isLoading}
        />
      </View>
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={styles.stepTitle}>Completa tu perfil</Text>
      <Text style={styles.stepSubtitle}>
        Estos datos nos ayudan a generar tu perfil inicial dentro de la app.
      </Text>

      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Apellido</Text>
        <TextInput
          value={apellido}
          onChangeText={setApellido}
          placeholder="Ulloa"
          placeholderTextColor="rgba(255,255,255,0.35)"
          style={styles.input}
          autoCapitalize="words"
          autoCorrect={false}
          editable={!isLoading}
        />
      </View>

      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Fecha de nacimiento</Text>
        <TextInput
          value={fecNacimiento}
          onChangeText={value => setFecNacimiento(formatBirthDateInput(value))}
          placeholder="1998-01-20"
          placeholderTextColor="rgba(255,255,255,0.35)"
          style={styles.input}
          keyboardType="number-pad"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
          maxLength={10}
        />
        <Text style={styles.helper}>
          Formato YYYY-MM-DD. Ejemplo: 1998-01-20
        </Text>
      </View>
    </>
  );

  const renderStep3 = () => (
    <>
      <Text style={styles.stepTitle}>¿Cuál es tu género?</Text>
      <Text style={styles.stepSubtitle}>
        Es necesario para tablas y métricas, pero no aparecerá públicamente.
      </Text>

      <Pressable
        onPress={() => setGenero('M')}
        disabled={isLoading}
        style={[
          styles.optionButton,
          genero === 'M' && styles.optionButtonActive,
        ]}>
        <Text
          style={[
            styles.optionButtonText,
            genero === 'M' && styles.optionButtonTextActive,
          ]}>
          Hombre
        </Text>
      </Pressable>

      <Pressable
        onPress={() => setGenero('F')}
        disabled={isLoading}
        style={[
          styles.optionButton,
          genero === 'F' && styles.optionButtonActive,
        ]}>
        <Text
          style={[
            styles.optionButtonText,
            genero === 'F' && styles.optionButtonTextActive,
          ]}>
          Mujer
        </Text>
      </Pressable>

      <Pressable
        onPress={() => setGenero('O')}
        disabled={isLoading}
        style={[
          styles.optionButton,
          genero === 'O' && styles.optionButtonActive,
        ]}>
        <Text
          style={[
            styles.optionButtonText,
            genero === 'O' && styles.optionButtonTextActive,
          ]}>
          Otro
        </Text>
      </Pressable>

      <Text style={styles.helperCentered}>
        Tu género no aparecerá en tu perfil ni en información pública.
      </Text>
    </>
  );

  const renderStep4 = () => (
    <>
      <Text style={styles.stepTitle}>Tus métricas físicas</Text>

      <Text style={styles.stepSubtitle}>
        Estos datos nos permiten calcular estadísticas de peso, progreso corporal,
        calorías estimadas e indicadores de evolución en el tiempo.
      </Text>

      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Peso actual</Text>

        <TextInput
          value={pesoKg}
          onChangeText={value => setPesoKg(normalizeDecimalInput(value))}
          placeholder="Ejemplo: 82.5"
          placeholderTextColor="rgba(255,255,255,0.35)"
          style={styles.input}
          keyboardType="decimal-pad"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
        />

        <Text style={styles.helper}>Ingresa tu peso actual en kilogramos.</Text>
      </View>

      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Altura</Text>

        <TextInput
          value={alturaCm}
          onChangeText={value => setAlturaCm(normalizeDecimalInput(value))}
          placeholder="Ejemplo: 176"
          placeholderTextColor="rgba(255,255,255,0.35)"
          style={styles.input}
          keyboardType="decimal-pad"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
        />

        <Text style={styles.helper}>Ingresa tu altura en centímetros.</Text>
      </View>

      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Peso objetivo opcional</Text>

        <TextInput
          value={pesoObjetivoKg}
          onChangeText={value =>
            setPesoObjetivoKg(normalizeDecimalInput(value))
          }
          placeholder="Ejemplo: 76"
          placeholderTextColor="rgba(255,255,255,0.35)"
          style={styles.input}
          keyboardType="decimal-pad"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
        />

        <Text style={styles.helper}>
          No es obligatorio. Sirve para mostrar progreso hacia una meta.
        </Text>
      </View>
    </>
  );

  const renderStep5 = () => (
    <>
      <Text style={styles.stepTitle}>Tu privacidad es importante</Text>
      <Text style={styles.stepSubtitle}>
        Tus datos se usarán para autenticación, experiencia, métricas y
        personalización dentro de GeoZone.
      </Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Resumen de tu cuenta</Text>

        <Text style={styles.summaryText}>
          Correo: {email.trim().toLowerCase()}
        </Text>

        <Text style={styles.summaryText}>Nick: {nick.trim()}</Text>

        <Text style={styles.summaryText}>
          Nombre: {nombre.trim()} {apellido.trim()}
        </Text>

        <Text style={styles.summaryText}>
          Fecha de nacimiento: {fecNacimiento.trim()}
        </Text>

        <Text style={styles.summaryText}>
          Género:{' '}
          {genero === 'M' ? 'Hombre' : genero === 'F' ? 'Mujer' : 'Otro'}
        </Text>

        <Text style={styles.summaryText}>Peso actual: {pesoKg.trim()} kg</Text>

        <Text style={styles.summaryText}>Altura: {alturaCm.trim()} cm</Text>

        {pesoObjetivoKg.trim() ? (
          <Text style={styles.summaryText}>
            Peso objetivo: {pesoObjetivoKg.trim()} kg
          </Text>
        ) : null}
      </View>

      <Text style={styles.helperCentered}>
        Más adelante podrás editar o ampliar tu perfil desde la app.
      </Text>
    </>
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return renderStep0();

      case 1:
        return renderStep1();

      case 2:
        return renderStep2();

      case 3:
        return renderStep3();

      case 4:
        return renderStep4();

      case 5:
        return renderStep5();

      default:
        return null;
    }
  };

  return (
    <>
      <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor="#050505" />
        <View style={styles.bottomGlow} />

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            style={styles.flex}
            scrollEnabled={shouldScroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
              styles.scrollContent,
              !shouldScroll && styles.scrollContentNoScroll,
            ]}
            onLayout={event => {
              setViewportHeight(event.nativeEvent.layout.height);
            }}
            onContentSizeChange={(_, height) => {
              setContentHeight(height);
            }}>
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

              <Text style={styles.registerSubtitle}>Crea tu cuenta</Text>
            </View>

            <View style={styles.formCard}>
              <View style={styles.progressRow}>
                <View style={styles.progressPill}>
                  <Text style={styles.progressPillText}>{progress}</Text>
                </View>
              </View>

              {renderStep()}

              <View style={styles.actionsRow}>
                <Pressable
                  onPress={onBack}
                  disabled={isLoading}
                  style={({pressed}) => [
                    styles.secondaryButton,
                    pressed && styles.buttonPressed,
                  ]}>
                  <Text style={styles.secondaryButtonText}>
                    {step === 0 ? 'Volver' : 'Atrás'}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={onContinue}
                  disabled={isLoading}
                  style={({pressed}) => [
                    styles.primaryButton,
                    pressed && styles.buttonPressed,
                    isLoading && styles.buttonDisabled,
                  ]}>
                  {isLoading ? (
                    <ActivityIndicator color="#0A0A0A" />
                  ) : (
                    <Text style={styles.primaryButtonText}>
                      {step === 5 ? 'Conquistar' : 'Continuar'}
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <AppAlertModal
        visible={dialogVisible}
        title={dialogTitle}
        message={dialogMessage}
        onClose={() => setDialogVisible(false)}
      />
    </>
  );
}