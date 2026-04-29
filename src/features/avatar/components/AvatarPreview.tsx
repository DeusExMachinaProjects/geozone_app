import React from 'react';
import {Image, ImageSourcePropType, StyleSheet, View} from 'react-native';

import {
  avatarAccessoryAssets,
  avatarBodyAssets,
  avatarBottomAssets,
  avatarHairAssets,
  avatarShoesAssets,
  avatarTopAssets,
} from '../data/avatarAssets';

import type {
  AvatarAccessoryStyle,
  AvatarBodyType,
  AvatarBottomStyle,
  AvatarConfig,
  AvatarDirection,
  AvatarHairStyle,
  AvatarLayerImages,
  AvatarShoesStyle,
  AvatarTopStyle,
} from '../types';

type AvatarPreviewMode =
  | 'full'
  | 'body'
  | 'hair'
  | 'top'
  | 'bottom'
  | 'shoes'
  | 'accessory';

type AvatarPreviewProps = {
  config?: Partial<AvatarConfig> | null;
  direction?: AvatarDirection;
  size?: number;
  showShadow?: boolean;
  previewMode?: AvatarPreviewMode;
};

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  bodyType: 'masculine',
  hairStyle: 'spiky',
  topStyle: 'shirt',
  bottomStyle: 'pants',
  shoesStyle: 'sneakers',
  accessoryStyle: 'none',
};

function normalizeAvatarConfig(config?: Partial<AvatarConfig> | null): AvatarConfig {
  return {
    ...DEFAULT_AVATAR_CONFIG,
    ...(config ?? {}),
  };
}

function normalizeDirection(direction?: AvatarDirection): AvatarDirection {
  if (
    direction === 'front' ||
    direction === 'right' ||
    direction === 'back' ||
    direction === 'left'
  ) {
    return direction;
  }

  return 'front';
}

function resolveDirectionalAsset<T extends string>(
  assets: Partial<Record<T, AvatarLayerImages>>,
  id: T | undefined,
  direction: AvatarDirection,
): ImageSourcePropType | null {
  if (!id) {
    return null;
  }

  const group = assets[id];

  if (!group) {
    return null;
  }

  return group[direction] ?? group.front ?? null;
}

function buildAvatarLayers(
  rawConfig: Partial<AvatarConfig> | AvatarConfig | null | undefined,
  rawDirection: AvatarDirection | undefined,
  previewMode: AvatarPreviewMode,
): ImageSourcePropType[] {
  const config = normalizeAvatarConfig(rawConfig);
  const direction = normalizeDirection(rawDirection);

  const body = resolveDirectionalAsset(
    avatarBodyAssets,
    config.bodyType as AvatarBodyType,
    direction,
  );

  const hair = resolveDirectionalAsset(
    avatarHairAssets,
    config.hairStyle as AvatarHairStyle,
    direction,
  );

  const top = resolveDirectionalAsset(
    avatarTopAssets,
    config.topStyle as AvatarTopStyle,
    direction,
  );

  const bottom = resolveDirectionalAsset(
    avatarBottomAssets,
    config.bottomStyle as AvatarBottomStyle,
    direction,
  );

  const shoes = resolveDirectionalAsset(
    avatarShoesAssets,
    config.shoesStyle as AvatarShoesStyle,
    direction,
  );

  const accessory =
    config.accessoryStyle === 'none'
      ? null
      : resolveDirectionalAsset(
          avatarAccessoryAssets,
          config.accessoryStyle as AvatarAccessoryStyle,
          direction,
        );

  switch (previewMode) {
    case 'body':
      return body ? [body] : [];

    case 'hair':
      return hair ? [hair] : [];

    case 'top':
      return top ? [top] : [];

    case 'bottom':
      return bottom ? [bottom] : [];

    case 'shoes':
      return shoes ? [shoes] : [];

    case 'accessory':
      return accessory ? [accessory] : [];

    case 'full':
    default:
      return [body, bottom, shoes, top, hair, accessory].filter(
        Boolean,
      ) as ImageSourcePropType[];
  }
}

export function AvatarPreview({
  config,
  direction = 'front',
  size = 180,
  showShadow = true,
  previewMode = 'full',
}: AvatarPreviewProps) {
  const safeDirection = normalizeDirection(direction);
  const layers = buildAvatarLayers(config, safeDirection, previewMode);

  return (
    <View style={[styles.container, {width: size, height: size}]}>
      {showShadow ? (
        <View
          style={[
            styles.shadow,
            {
              width: size * 0.42,
              height: size * 0.12,
              borderRadius: size * 0.06,
              bottom: size * 0.12,
            },
          ]}
        />
      ) : null}

      {layers.map((source, index) => (
        <Image
          key={`${previewMode}-${safeDirection}-${index}`}
          source={source}
          resizeMode="contain"
          style={[
            styles.layer,
            {
              width: size,
              height: size,
            },
          ]}
        />
      ))}
    </View>
  );
}

export default AvatarPreview;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },

  layer: {
    position: 'absolute',
    left: 0,
    top: 0,
  },

  shadow: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.34)',
  },
});