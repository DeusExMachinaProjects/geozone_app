import React, {useMemo} from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {
  AvatarConfig,
  AvatarDirection,
  DEFAULT_AVATAR_CONFIG,
} from '../types';
import {
  avatarAccessoryAssets,
  avatarBodyAssets,
  avatarBottomAssets,
  avatarHairAssets,
  avatarShoesAssets,
  avatarTopAssets,
} from '../data/avatarSpriteManifest';

type AvatarPreviewProps = {
  config?: Partial<AvatarConfig>;
  direction?: AvatarDirection;
  size?: number;
  showShadow?: boolean;
  style?: StyleProp<ViewStyle>;
};

function safeAsset(
  asset?: ImageSourcePropType,
  fallback?: ImageSourcePropType,
): ImageSourcePropType | undefined {
  return asset ?? fallback;
}

export function AvatarPreview({
  config,
  direction = 'front',
  size = 180,
  showShadow = true,
  style,
}: AvatarPreviewProps) {
  const avatarConfig = useMemo<AvatarConfig>(
    () => ({
      ...DEFAULT_AVATAR_CONFIG,
      ...(config ?? {}),
    }),
    [config],
  );

  const body =
    safeAsset(
      avatarBodyAssets[avatarConfig.bodyType]?.[direction],
      avatarBodyAssets[DEFAULT_AVATAR_CONFIG.bodyType][direction],
    ) ?? avatarBodyAssets.masculine.front;

  const hair =
    safeAsset(
      avatarHairAssets[avatarConfig.hairStyle]?.[direction],
      avatarHairAssets[DEFAULT_AVATAR_CONFIG.hairStyle][direction],
    ) ?? avatarHairAssets.spiky.front;

  const top =
    safeAsset(
      avatarTopAssets[avatarConfig.topStyle]?.[direction],
      avatarTopAssets[DEFAULT_AVATAR_CONFIG.topStyle][direction],
    ) ?? avatarTopAssets.shirt.front;

  const bottom =
    safeAsset(
      avatarBottomAssets[avatarConfig.bottomStyle]?.[direction],
      avatarBottomAssets[DEFAULT_AVATAR_CONFIG.bottomStyle][direction],
    ) ?? avatarBottomAssets.pants.front;

  const shoes =
    safeAsset(
      avatarShoesAssets[avatarConfig.shoesStyle]?.[direction],
      avatarShoesAssets[DEFAULT_AVATAR_CONFIG.shoesStyle][direction],
    ) ?? avatarShoesAssets.sneakers.front;

  const accessory =
    avatarConfig.accessoryStyle === 'none'
      ? undefined
      : avatarAccessoryAssets[avatarConfig.accessoryStyle]?.[direction];

  return (
    <View
      style={[
        styles.root,
        {
          width: size,
          height: size,
        },
        style,
      ]}>
      {showShadow ? (
        <View
          pointerEvents="none"
          style={[
            styles.shadow,
            {
              width: size * 0.36,
              height: size * 0.12,
              bottom: size * 0.13,
              borderRadius: size,
            },
          ]}
        />
      ) : null}

      <Image source={body} style={styles.layer} resizeMode="contain" />
      <Image source={bottom} style={styles.layer} resizeMode="contain" />
      <Image source={shoes} style={styles.layer} resizeMode="contain" />
      <Image source={top} style={styles.layer} resizeMode="contain" />
      <Image source={hair} style={styles.layer} resizeMode="contain" />

      {accessory ? (
        <Image source={accessory} style={styles.layer} resizeMode="contain" />
      ) : null}
    </View>
  );
}

export default AvatarPreview;

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  layer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  shadow: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.35)',
    transform: [{scaleX: 1.2}],
  },
});