import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {AvatarOption} from '../types';

type Props<T extends string> = {
  title: string;
  value: T;
  options: AvatarOption<T>[];
  onChange: (value: T) => void;
};

export function AvatarOptionSelector<T extends string>({
  title,
  value,
  options,
  onChange,
}: Props<T>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.optionsWrap}>
        {options.map(option => {
          const selected = option.value === value;

          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              style={[styles.optionButton, selected && styles.optionButtonActive]}>
              <Text
                style={[
                  styles.optionLabel,
                  selected && styles.optionLabelActive,
                ]}>
                {option.label}
              </Text>
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
    marginBottom: 10,
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  optionButtonActive: {
    borderColor: '#FF6B52',
    backgroundColor: 'rgba(255,107,82,0.16)',
  },
  optionLabel: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 13,
    fontWeight: '600',
  },
  optionLabelActive: {
    color: '#FFFFFF',
  },
});