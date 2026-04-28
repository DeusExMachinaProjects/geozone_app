import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import type {AvatarConfig, AvatarDirection} from '../types';
import {
  avatarAccessoryAssets,
  avatarBodyAssets,
  avatarBottomAssets,
  avatarHairAssets,
  avatarShoesAssets,
  avatarTopAssets,
} from '../data/avatarAssets';

type AvatarPreviewProps = {
  config: AvatarConfig;
  direction?: AvatarDirection;
  size?: number;
  showShadow?: boolean;
};

export function AvatarPreview({
  config,
  direction = 'front',
  size = 180,
  showShadow = true,
}: AvatarPreviewProps) {
  const body = avatarBodyAssets[config.bodyType]?.[direction];
  const hair = avatarHairAssets[config.hairStyle]?.[direction];
  const top = avatarTopAssets[config.topStyle]?.[direction];
  const bottom = avatarBottomAssets[config.bottomStyle]?.[direction];
  const shoes = avatarShoesAssets[config.shoesStyle]?.[direction];
  const accessory =
    config.accessoryStyle === 'none'
      ? undefined
      : avatarAccessoryAssets[config.accessoryStyle]?.[direction];

  return (
    <View style={[styles.stage, {width: size, height: size}]}>
      {showShadow ? <View style={styles.shadow} /> : null}

      {body ? (
        <Image source={body} style={styles.layer} resizeMode="contain" />
      ) : null}

      {bottom ? (
        <Image source={bottom} style={styles.layer} resizeMode="contain" />
      ) : null}

      {shoes ? (
        <Image source={shoes} style={styles.layer} resizeMode="contain" />
      ) : null}

      {top ? (
        <Image source={top} style={styles.layer} resizeMode="contain" />
      ) : null}

      {hair ? (
        <Image source={hair} style={styles.layer} resizeMode="contain" />
      ) : null}

      {accessory ? (
        <Image source={accessory} style={styles.layer} resizeMode="contain" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },

  layer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  shadow: {
    position: 'absolute',
    bottom: '14%',
    width: '34%',
    height: '9%',
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.36)',
    transform: [{scaleX: 1.45}],
  },
});