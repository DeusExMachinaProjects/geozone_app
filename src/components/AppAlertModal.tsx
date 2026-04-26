import React from 'react';
import {Modal, Pressable, Text, View} from 'react-native';
import {styles} from '../theme/screens/AppAlertModal.styles';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  onClose: () => void;
};

export function AppAlertModal({
  visible,
  title,
  message,
  confirmText = 'OK',
  onClose,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            <Pressable
              style={({pressed}) => [
                styles.primaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={onClose}>
              <Text style={styles.primaryButtonText}>{confirmText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}