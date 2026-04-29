import React, {memo, useMemo} from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

import {
  avatarAccessoryAssets,
  avatarBodyAssets,
  avatarBottomAssets,
  avatarHairAssets,
  avatarShoeAssets,
  avatarTopAssets,
} from '../data/avatarSpriteManifest';
import type {AvatarConfig, AvatarDirection} from '../types';

type AvatarPreviewProps = {
  config?: AvatarConfig;
  direction?: AvatarDirection;
  size?: number;
  showShadow?: boolean;
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  bodyType: 'masculine',
  skinTone: 'tone1',
  hairStyle: 'spiky',
  hairColor: 'blonde',
  topStyle: 'shirt',
  topColor: 'orange',
  bottomStyle: 'pants',
  bottomColor: 'black',
  shoeStyle: 'sneakers',
  shoeColor: 'white',
  accessoryStyle: 'none',
};

function getDirectionalAsset<T extends string>(
  assetMap: Record<string, Partial<Record<AvatarDirection, ImageSourcePropType>>>,
  key: T | undefined,
  direction: AvatarDirection,
): ImageSourcePropType | undefined {
  if (!key || key === 'none') {
    return undefined;
  }

  const group = assetMap[String(key)];

  if (!group) {
    return undefined;
  }

  return group[direction] ?? group.front;
}

function SpriteLayer({
  source,
  size,
  zIndex,
}: {
  source?: ImageSourcePropType;
  size: number;
  zIndex: number;
}) {
  if (!source) {
    return null;
  }

  return (
    <Image
      source={source}
      resizeMode="contain"
      fadeDuration={0}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        left: 0,
        top: 0,
        zIndex,
      }}
    />
  );
}

export const AvatarPreview = memo(function AvatarPreview({
  config,
  direction = 'front',
  size = 180,
  showShadow = true,
  style,
}: AvatarPreviewProps) {
  const safeConfig = useMemo<AvatarConfig>(() => {
    return {
      ...DEFAULT_AVATAR_CONFIG,
      ...(config ?? {}),
    };
  }, [config]);

  const body = getDirectionalAsset(
    avatarBodyAssets,
    safeConfig.bodyType,
    direction,
  );

  const hair = getDirectionalAsset(
    avatarHairAssets,
    safeConfig.hairStyle,
    direction,
  );

  const top = getDirectionalAsset(
    avatarTopAssets,
    safeConfig.topStyle,
    direction,
  );

  const bottom = getDirectionalAsset(
    avatarBottomAssets,
    safeConfig.bottomStyle,
    direction,
  );

  const shoes = getDirectionalAsset(
    avatarShoeAssets,
    safeConfig.shoeStyle,
    direction,
  );

  const accessory = getDirectionalAsset(
    avatarAccessoryAssets,
    safeConfig.accessoryStyle,
    direction,
  );

  return (
    <View
      pointerEvents="none"
      style={[
        {
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}>
      {showShadow ? (
        <View
          style={{
            position: 'absolute',
            bottom: Math.round(size * 0.12),
            width: Math.round(size * 0.42),
            height: Math.round(size * 0.1),
            borderRadius: 999,
            backgroundColor: 'rgba(0,0,0,0.38)',
            transform: [{scaleX: 1.25}],
          }}
        />
      ) : null}

      <View
        style={{
          width: size,
          height: size,
          position: 'relative',
          overflow: 'visible',
        }}>
        {/* Mochila u otros accesorios traseros deberían ir detrás del cuerpo.
            Si después separas mochila frontal/trasera, podemos dividirla mejor. */}
        {safeConfig.accessoryStyle === 'backpack' ? (
          <SpriteLayer source={accessory} size={size} zIndex={1} />
        ) : null}

        <SpriteLayer source={body} size={size} zIndex={2} />
        <SpriteLayer source={bottom} size={size} zIndex={3} />
        <SpriteLayer source={shoes} size={size} zIndex={4} />
        <SpriteLayer source={top} size={size} zIndex={5} />
        <SpriteLayer source={hair} size={size} zIndex={6} />

        {safeConfig.accessoryStyle !== 'none' &&
        safeConfig.accessoryStyle !== 'backpack' ? (
          <SpriteLayer source={accessory} size={size} zIndex={7} />
        ) : null}
      </View>
    </View>
  );
});