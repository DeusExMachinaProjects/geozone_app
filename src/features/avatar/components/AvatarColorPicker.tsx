import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {AVATAR_COLOR_LABELS, AVATAR_COLOR_PALETTE} from '../palette';
import {AVATAR_COLOR_KEYS, AvatarColorKey} from '../types';

type Props = {
  title: string;
  value: AvatarColorKey;
  onChange: (value: AvatarColorKey) => void;
};

export function AvatarColorPicker({title, value, onChange}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title}: <Text style={styles.valueText}>{AVATAR_COLOR_LABELS[value]}</Text>
      </Text>

      <View style={styles.grid}>
        {AVATAR_COLOR_KEYS.map(colorKey => {
          const selected = colorKey === value;

          return (
            <Pressable
              key={colorKey}
              onPress={() => onChange(colorKey)}
              style={[
                styles.swatchOuter,
                selected && styles.swatchOuterSelected,
              ]}>
              <View
                style={[
                  styles.swatchInner,
                  {backgroundColor: AVATAR_COLOR_PALETTE[colorKey]},
                ]}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  valueText: {
    color: '#FFB199',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  swatchOuter: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  swatchOuterSelected: {
    borderColor: '#FF6B52',
    transform: [{scale: 1.06}],
  },
  swatchInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
  },
});