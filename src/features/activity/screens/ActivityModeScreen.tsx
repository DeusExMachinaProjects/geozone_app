import React from 'react';
import {Pressable, StatusBar, Text, View} from 'react-native';
import {ScreenContainer} from '../../../components/ScreenContainer';
import {styles} from '../../../theme/screens/ActivityModeScreen.styles';

type ActivityModeConfig = {
  accentColor: string;
  accentSoft: string;
  buttonTextColor: string;
  badge: string;
  title: string;
  subtitle: string;
  summaryTitle: string;
  summaryMetrics: Array<{
    label: string;
    value: string;
  }>;
  summaryLines: string[];
  recommendationsTitle: string;
  recommendations: string[];
  primaryLabel: string;
  helperText: string;
};

type Props = {
  config: ActivityModeConfig;
  onBack: () => void;
  onStart: () => void;
};

export function ActivityModeScreen({config, onBack, onStart}: Props) {
  return (
    <ScreenContainer scroll contentStyle={styles.content}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </Pressable>

        <View
          style={[
            styles.badge,
            {
              backgroundColor: config.accentSoft,
              borderColor: config.accentColor,
            },
          ]}>
          <Text style={[styles.badgeText, {color: config.accentColor}]}>
            {config.badge}
          </Text>
        </View>

        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.subtitle}>{config.subtitle}</Text>
      </View>

      <View style={styles.cardsGroup}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={[styles.cardAccent, {backgroundColor: config.accentColor}]}
            />
            <Text style={styles.cardTitle}>{config.summaryTitle}</Text>
          </View>

          <View style={styles.metricsRow}>
            {config.summaryMetrics.map(metric => (
              <View key={metric.label} style={styles.metricPill}>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <Text style={styles.metricValue}>{metric.value}</Text>
              </View>
            ))}
          </View>

          <View style={{marginTop: 10}}>
            {config.summaryLines.map(line => (
              <Text key={line} style={styles.cardText}>
                {line}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={[styles.cardAccent, {backgroundColor: config.accentColor}]}
            />
            <Text style={styles.cardTitle}>{config.recommendationsTitle}</Text>
          </View>

          {config.recommendations.map(item => (
            <View key={item} style={styles.bulletRow}>
              <View
                style={[styles.bulletDot, {backgroundColor: config.accentColor}]}
              />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}

          <Pressable
            style={[
              styles.primaryButton,
              {
                backgroundColor: config.accentColor,
              },
            ]}
            onPress={onStart}>
            <Text
              style={[
                styles.primaryButtonText,
                {color: config.buttonTextColor},
              ]}>
              {config.primaryLabel}
            </Text>
          </Pressable>

          <Text style={styles.helperText}>{config.helperText}</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}