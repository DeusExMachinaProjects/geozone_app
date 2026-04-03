import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {colors, radius, spacing} from '../theme';

type Variant = 'primary' | 'secondary';

type Props = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: Variant;
};

export function PrimaryButton({
  title,
  onPress,
  variant = 'primary',
}: Props) {
  const isSecondary = variant === 'secondary';

  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.base,
        isSecondary ? styles.secondary : styles.primary,
        pressed && styles.pressed,
      ]}>
      <Text
        style={[
          styles.text,
          isSecondary ? styles.secondaryText : styles.primaryText,
        ]}>
        {title}
      </Text>
    </Pressable>
  );
}

type NamedStyles = {
  base: ViewStyle;
  primary: ViewStyle;
  secondary: ViewStyle;
  pressed: ViewStyle;
  text: TextStyle;
  primaryText: TextStyle;
  secondaryText: TextStyle;
};

const styles = StyleSheet.create<NamedStyles>({
  base: {
    minHeight: 54,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.9,
  },
  text: {
    fontSize: 16,
    fontWeight: '800',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: colors.primary,
  },
});