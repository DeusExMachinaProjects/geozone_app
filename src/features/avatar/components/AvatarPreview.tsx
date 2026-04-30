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

import {
  AvatarLayerKey,
  FULL_PREVIEW_BODY_RATIO,
  FULL_PREVIEW_BODY_TOP_RATIO,
  getAvatarLayerOrder,
  getAvatarLayerPlacements,
} from '../data/avatarLayerConfig';

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

type LayerRenderItem = {
  key: AvatarLayerKey;
  source: ImageSourcePropType;
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

function getLayerSources(
  config: AvatarConfig,
  direction: AvatarDirection,
): Partial<Record<AvatarLayerKey, ImageSourcePropType | null>> {
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

  return {
    body,
    hair,
    top,
    bottom,
    shoes,
    accessory,
  };
}

function modeToLayerKey(previewMode: AvatarPreviewMode): AvatarLayerKey | null {
  switch (previewMode) {
    case 'body':
      return 'body';
    case 'hair':
      return 'hair';
    case 'top':
      return 'top';
    case 'bottom':
      return 'bottom';
    case 'shoes':
      return 'shoes';
    case 'accessory':
      return 'accessory';
    case 'full':
    default:
      return null;
  }
}

function buildFullLayerList(
  config: AvatarConfig,
  direction: AvatarDirection,
): LayerRenderItem[] {
  const layerSources = getLayerSources(config, direction);
  const orderedLayers = getAvatarLayerOrder(config, direction);

  return orderedLayers
    .map(layerKey => {
      const source = layerSources[layerKey];

      if (!source) {
        return null;
      }

      return {
        key: layerKey,
        source,
      };
    })
    .filter(Boolean) as LayerRenderItem[];
}

function getSoloPreviewStyle(previewMode: AvatarPreviewMode, size: number) {
  switch (previewMode) {
    case 'body':
      return {
        width: size * 0.84,
        height: size * 0.84,
        left: size * 0.08,
        top: size * 0.08,
      };

    case 'hair':
      return {
        width: size * 0.72,
        height: size * 0.72,
        left: size * 0.14,
        top: size * 0.10,
      };

    case 'top':
      return {
        width: size * 0.72,
        height: size * 0.72,
        left: size * 0.14,
        top: size * 0.12,
      };

    case 'bottom':
      return {
        width: size * 0.68,
        height: size * 0.68,
        left: size * 0.16,
        top: size * 0.16,
      };

    case 'shoes':
      return {
        width: size * 0.58,
        height: size * 0.58,
        left: size * 0.21,
        top: size * 0.22,
      };

    case 'accessory':
      return {
        width: size * 0.60,
        height: size * 0.60,
        left: size * 0.20,
        top: size * 0.20,
      };

    default:
      return {
        width: size * 0.72,
        height: size * 0.72,
        left: size * 0.14,
        top: size * 0.14,
      };
  }
}

export function AvatarPreview({
  config,
  direction = 'front',
  size = 180,
  showShadow = true,
  previewMode = 'full',
}: AvatarPreviewProps) {
  const safeConfig = normalizeAvatarConfig(config);
  const safeDirection = normalizeDirection(direction);

  const layerSources = getLayerSources(safeConfig, safeDirection);

  if (previewMode !== 'full') {
    const singleLayerKey = modeToLayerKey(previewMode);

    if (!singleLayerKey) {
      return <View style={[styles.root, {width: size, height: size}]} />;
    }

    const source = layerSources[singleLayerKey];

    if (!source) {
      return <View style={[styles.root, {width: size, height: size}]} />;
    }

    const soloStyle = getSoloPreviewStyle(previewMode, size);

    return (
      <View style={[styles.root, {width: size, height: size}]}>
        <View style={[styles.stage, {width: size, height: size}]}>
          <Image
            source={source}
            resizeMode="contain"
            style={[styles.layer, soloStyle]}
          />
        </View>
      </View>
    );
  }

  const layers = buildFullLayerList(safeConfig, safeDirection);
  const placements = getAvatarLayerPlacements(safeConfig, safeDirection);

  /**
   * BODY = referencia principal del avatar.
   */
  const bodySize = size * FULL_PREVIEW_BODY_RATIO;
  const bodyLeft = (size - bodySize) / 2;
  const bodyTop = size * FULL_PREVIEW_BODY_TOP_RATIO;

  return (
    <View style={[styles.root, {width: size, height: size}]}>
      <View style={[styles.stage, {width: size, height: size}]}>
        {showShadow ? (
          <View
            style={[
              styles.shadow,
              {
                width: size * 0.42,
                height: size * 0.12,
                borderRadius: size * 0.06,
                bottom: size * 0.14,
              },
            ]}
          />
        ) : null}

        {layers.map(layer => {
          const placement = placements[layer.key];

          const layerSize =
            layer.key === 'body'
              ? bodySize
              : bodySize * placement.sizeRatio;

          const left =
            layer.key === 'body'
              ? bodyLeft
              : bodyLeft +
                (bodySize - layerSize) / 2 +
                bodySize * placement.offsetX;

          const top =
            layer.key === 'body'
              ? bodyTop
              : bodyTop + bodySize * placement.offsetY;

          return (
            <Image
              key={`${previewMode}-${safeDirection}-${layer.key}`}
              source={layer.source}
              resizeMode="contain"
              style={[
                styles.layer,
                {
                  width: layerSize,
                  height: layerSize,
                  left,
                  top,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

export default AvatarPreview;

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
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