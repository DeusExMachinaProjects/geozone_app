import React, {ReactNode} from 'react';
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {spacing} from '../theme';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
};

export function ScreenContainer({
  children,
  scroll = true,
  contentStyle,
  backgroundColor = '#050505',
}: Props) {
  if (scroll) {
    return (
      <SafeAreaView
        style={[styles.safeArea, {backgroundColor}]}
        edges={['top', 'bottom']}>
        <ScrollView
          style={styles.flex}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, contentStyle]}>
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, {backgroundColor}]}
      edges={['top', 'bottom']}>
      <View style={[styles.staticContent, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  staticContent: {
    flex: 1,
    padding: spacing.lg,
  },
});