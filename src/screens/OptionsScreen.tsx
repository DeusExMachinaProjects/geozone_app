import React, {useMemo, useState} from 'react';
import {Modal, Pressable, StatusBar, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ScreenContainer} from '../components/ScreenContainer';
import {styles} from '../theme/screens/OptionsScreen.styles';
import {useAuth} from '../app/providers/AuthProvider';

export function OptionsScreen() {
  const navigation = useNavigation();
  const {session, signOut} = useAuth();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const displayName = useMemo(() => {
    return (
      session?.user?.NICK?.trim() ||
      session?.user?.NOMBRE?.trim() ||
      'Usuario'
    );
  }, [session]);

  const email = session?.user?.EMAIL ?? '';

  const openLogoutModal = () => {
    setLogoutModalVisible(true);
  };

  const closeLogoutModal = () => {
    setLogoutModalVisible(false);
  };

  const confirmLogout = async () => {
    try {
      setLogoutModalVisible(false);
      await signOut();
    } catch (error) {
      console.error('logout error:', error);
    }
  };

  return (
    <>
      <ScreenContainer scroll contentStyle={styles.content}>
        <StatusBar barStyle="light-content" backgroundColor="#050505" />

        <View style={styles.header}>
          <Pressable
            style={({pressed}) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Volver</Text>
          </Pressable>

          <Text style={styles.title}>Opciones</Text>
          <Text style={styles.subtitle}>
            Configura tu perfil, notificaciones y preferencias de actividad.
          </Text>
        </View>

        <View style={styles.optionCard}>
          <Text style={styles.optionTitle}>Sesión actual</Text>
          <Text style={styles.optionText}>Usuario: {displayName}</Text>
          <Text style={styles.optionText}>{email}</Text>
        </View>

        <View style={styles.optionCard}>
          <Text style={styles.optionTitle}>Perfil</Text>
          <Text style={styles.optionText}>
            Editar nombre, avatar y biografía.
          </Text>
        </View>

        <View style={styles.optionCard}>
          <Text style={styles.optionTitle}>Notificaciones</Text>
          <Text style={styles.optionText}>
            Gestiona alertas de amigos, logros y misiones.
          </Text>
        </View>

        <View style={styles.optionCard}>
          <Text style={styles.optionTitle}>Privacidad</Text>
          <Text style={styles.optionText}>
            Define quién puede ver tus rutas y estadísticas.
          </Text>
        </View>

        <Pressable
          style={({pressed}) => [
            styles.logoutCard,
            pressed && styles.pressed,
          ]}
          onPress={openLogoutModal}>
          <Text style={styles.logoutTitle}>Cerrar sesión</Text>
          <Text style={styles.logoutText}>
            Salir de la cuenta actual en este dispositivo.
          </Text>
        </Pressable>
      </ScreenContainer>

      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeLogoutModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Cerrar sesión</Text>
            <Text style={styles.modalText}>
              ¿Seguro que quieres salir de GeoZone?
            </Text>

            <View style={styles.modalActions}>
              <Pressable
                style={({pressed}) => [
                  styles.modalSecondaryButton,
                  pressed && styles.pressed,
                ]}
                onPress={closeLogoutModal}>
                <Text style={styles.modalSecondaryButtonText}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={({pressed}) => [
                  styles.modalPrimaryButton,
                  pressed && styles.pressed,
                ]}
                onPress={() => {
                  void confirmLogout();
                }}>
                <Text style={styles.modalPrimaryButtonText}>
                  Cerrar sesión
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}