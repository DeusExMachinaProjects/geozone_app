import React from 'react';
import {
  Image,
  type ImageSourcePropType,
  StyleSheet,
  View,
} from 'react-native';
import {
  avatarAccessoryAssets,
  avatarBodyAssets,
  avatarBottomAssets,
  AvatarConfig,
  AvatarDirection,
  avatarFootwearAssets,
  avatarHairAssets,
  avatarTopAssets,
  defaultAvatarConfig,
} from '../data/avatarSpriteManifest';
import {
  AvatarLayerKey,
  BASE_SPRITE_CANVAS,
  getAvatarLayerOrder,
  getAvatarLayerTransforms,
} from '../data/avatarLayerConfig';

type AvatarPreviewProps = {
  config?: AvatarConfig;
  direction?: AvatarDirection;
  size?: number;
  showShadow?: boolean;
};

export function AvatarPreview({
  config = defaultAvatarConfig,
  direction = 'front',
  size = 180,
  showShadow = true,
}: AvatarPreviewProps) {
  const safeConfig = config ?? defaultAvatarConfig;
  const unit = size / BASE_SPRITE_CANVAS;

  const body = avatarBodyAssets[safeConfig.bodyType]?.[direction];
  const hair = avatarHairAssets[safeConfig.hairType]?.[direction];
  const top = avatarTopAssets[safeConfig.topType]?.[direction];
  const bottom = avatarBottomAssets[safeConfig.bottomType]?.[direction];
  const footwear = avatarFootwearAssets[safeConfig.footwearType]?.[direction];

  const accessory =
    safeConfig.accessoryType !== 'none'
      ? avatarAccessoryAssets[safeConfig.accessoryType]?.[direction]
      : undefined;

  const layerSources: Record<AvatarLayerKey, ImageSourcePropType | undefined> = {
    body,
    bottom,
    footwear,
    top,
    hair,
    accessory,
  };

  const orderedLayers = getAvatarLayerOrder(safeConfig, direction);
  const transforms = getAvatarLayerTransforms(safeConfig, direction);

  return (
    <View style={[styles.root, {width: size, height: size}]}>
      <View style={[styles.stage, {width: size, height: size}]}>
        {showShadow ? (
          <View
            style={[
              styles.shadow,
              {
                width: size * 0.44,
                height: size * 0.10,
                bottom: size * 0.06,
                borderRadius: size * 0.05,
              },
            ]}
          />
        ) : null}

        {orderedLayers.map(layerKey => {
          const source = layerSources[layerKey];
          if (!source) {
            return null;
          }

          const transform = transforms[layerKey];

          return (
            <Image
              key={layerKey}
              source={source}
              resizeMode="contain"
              style={[
                styles.layer,
                {
                  width: size,
                  height: size,
                  transform: [
                    {translateX: transform.x * unit},
                    {translateY: transform.y * unit},
                    {scale: transform.scale},
                  ],
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stage: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  layer: {
    position: 'absolute',
  },
  shadow: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
});