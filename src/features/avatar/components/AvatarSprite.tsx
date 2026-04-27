import React, {useMemo} from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import {
  getAvatarSpriteLayers,
  hasSpriteAssets,
} from '../data/avatarSpriteManifest';

import type {AvatarConfig, AvatarFacing} from '../types';
import {DEFAULT_AVATAR_CONFIG} from '../types';

type AvatarSpriteProps = {
  config: AvatarConfig;
  facing?: AvatarFacing;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function AvatarSprite({
  config,
  facing = 'front',
  size = 96,
  style,
}: AvatarSpriteProps) {
  const avatar = useMemo(
    () => ({
      ...DEFAULT_AVATAR_CONFIG,
      ...config,
    }),
    [config],
  );

  const layers = useMemo(
    () => getAvatarSpriteLayers(avatar, facing),
    [avatar, facing],
  );

  const useImageLayers = hasSpriteAssets(layers);

  if (useImageLayers) {
    return (
      <View style={[styles.root, {width: size, height: size}, style]}>
        {layers.map(layer => {
          if (!layer.source) {
            return null;
          }

          return (
            <Image
              key={layer.key}
              source={layer.source}
              resizeMode="contain"
              style={[
                styles.layerImage,
                {
                  width: size,
                  height: size,
                  tintColor: layer.tintColor,
                  transform: layer.flipX ? [{scaleX: -1}] : undefined,
                },
              ]}
            />
          );
        })}
      </View>
    );
  }

  return (
    <VectorFallbackSprite
      config={avatar}
      facing={facing}
      size={size}
      style={style}
    />
  );
}

type VectorFallbackSpriteProps = {
  config: AvatarConfig;
  facing: AvatarFacing;
  size: number;
  style?: StyleProp<ViewStyle>;
};

function VectorFallbackSprite({
  config,
  facing,
  size,
  style,
}: VectorFallbackSpriteProps) {
  const unit = size / 96;
  const px = (value: number) => value * unit;

  const isSide = facing === 'right' || facing === 'left';
  const isBack = facing === 'back';
  const isFeminine = config.bodyType === 'feminine';
  const flipX = facing === 'left' ? -1 : 1;

  const headLeft = isSide ? px(35) : px(28);
  const torsoLeft = isSide ? px(30) : px(23);
  const torsoWidth = isFeminine ? px(30) : px(36);

  return (
    <View style={[styles.root, {width: size, height: size}, style]}>
      <View
        style={[
          styles.vectorWrapper,
          {
            width: size,
            height: size,
            transform: [{scaleX: flipX}],
          },
        ]}>
        <View
          style={[
            styles.shadow,
            {
              width: px(32),
              height: px(8),
              borderRadius: px(6),
              bottom: px(6),
            },
          ]}
        />

        <View
          style={[
            styles.hairBack,
            {
              backgroundColor: config.hairColor,
              width: isFeminine ? px(30) : px(34),
              height: isFeminine ? px(22) : px(18),
              top: px(10),
              left: headLeft - px(2),
            },
          ]}
        />

        <View
          style={[
            styles.head,
            {
              backgroundColor: config.skinTone,
              width: px(28),
              height: px(28),
              borderRadius: px(8),
              top: px(14),
              left: headLeft,
            },
          ]}>
          {!isBack ? (
            <>
              <View
                style={[
                  styles.eye,
                  {
                    width: px(3),
                    height: px(4),
                    left: isSide ? px(14) : px(7),
                    top: px(9),
                  },
                ]}
              />
              {!isSide ? (
                <View
                  style={[
                    styles.eye,
                    {
                      width: px(3),
                      height: px(4),
                      right: px(7),
                      top: px(9),
                    },
                  ]}
                />
              ) : null}
              {!isSide ? (
                <View
                  style={[
                    styles.mouth,
                    {
                      width: px(6),
                      height: px(2),
                      top: px(18),
                      left: px(11),
                    },
                  ]}
                />
              ) : null}
            </>
          ) : null}
        </View>

        <View
          style={[
            styles.hairFront,
            {
              backgroundColor: config.hairColor,
              width: isFeminine ? px(31) : px(35),
              height: isFeminine ? px(11) : px(13),
              top: px(8),
              left: headLeft - px(3),
            },
          ]}
        />

        {config.hairStyle === 'spiky' || config.hairStyle === 'rebel' ? (
          <>
            <View
              style={[
                styles.spike,
                {
                  backgroundColor: config.hairColor,
                  width: px(8),
                  height: px(10),
                  top: px(4),
                  left: headLeft - px(2),
                  transform: [{rotate: '-22deg'}],
                },
              ]}
            />
            <View
              style={[
                styles.spike,
                {
                  backgroundColor: config.hairColor,
                  width: px(8),
                  height: px(12),
                  top: px(3),
                  left: headLeft + px(9),
                },
              ]}
            />
            <View
              style={[
                styles.spike,
                {
                  backgroundColor: config.hairColor,
                  width: px(8),
                  height: px(10),
                  top: px(4),
                  left: headLeft + px(19),
                  transform: [{rotate: '22deg'}],
                },
              ]}
            />
          </>
        ) : null}

        {config.accessory === 'cap' ? (
          <View
            style={[
              styles.cap,
              {
                backgroundColor: config.accessoryColor,
                width: px(34),
                height: px(10),
                borderRadius: px(4),
                top: px(8),
                left: headLeft - px(3),
              },
            ]}
          />
        ) : null}

        {config.accessory === 'glasses' && !isBack ? (
          <View
            style={[
              styles.glasses,
              {
                width: isSide ? px(8) : px(18),
                height: px(6),
                top: px(24),
                left: isSide ? headLeft + px(13) : headLeft + px(5),
              },
            ]}
          />
        ) : null}

        <View
          style={[
            styles.neck,
            {
              backgroundColor: config.skinTone,
              width: px(8),
              height: px(7),
              top: px(42),
              left: isSide ? px(41) : px(44),
            },
          ]}
        />

        <View
          style={[
            styles.arm,
            {
              backgroundColor: config.skinTone,
              width: px(7),
              height: px(27),
              top: px(47),
              left: isSide ? px(26) : px(14),
            },
          ]}
        />

        <View
          style={[
            styles.arm,
            {
              backgroundColor: config.skinTone,
              width: px(7),
              height: px(27),
              top: px(47),
              left: isSide ? px(58) : px(75),
            },
          ]}
        />

        <View
          style={[
            styles.torso,
            {
              backgroundColor: config.topColor,
              width: torsoWidth,
              height: px(30),
              borderRadius: px(6),
              top: px(46),
              left: torsoLeft,
            },
          ]}>
          {config.topStyle === 'hoodie' ? (
            <View
              style={[
                styles.hoodiePocket,
                {
                  width: px(14),
                  height: px(5),
                  borderRadius: px(3),
                  left: px(10),
                  bottom: px(5),
                },
              ]}
            />
          ) : null}

          {config.topStyle === 'jacket' ? (
            <View
              style={[
                styles.jacketLine,
                {
                  left: px(16),
                  top: px(3),
                  height: px(24),
                },
              ]}
            />
          ) : null}
        </View>

        <View
          style={[
            styles.leg,
            {
              backgroundColor: config.bottomColor,
              width: px(10),
              height: px(24),
              top: px(75),
              left: isSide ? px(37) : px(32),
            },
          ]}
        />

        <View
          style={[
            styles.leg,
            {
              backgroundColor: config.bottomColor,
              width: px(10),
              height: px(24),
              top: px(75),
              left: isSide ? px(49) : px(54),
            },
          ]}
        />

        <View
          style={[
            styles.shoe,
            {
              backgroundColor: config.shoeColor,
              width: px(13),
              height: px(7),
              borderRadius: px(3),
              top: px(97),
              left: isSide ? px(35) : px(29),
            },
          ]}
        />

        <View
          style={[
            styles.shoe,
            {
              backgroundColor: config.shoeColor,
              width: px(13),
              height: px(7),
              borderRadius: px(3),
              top: px(97),
              left: isSide ? px(48) : px(53),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  layerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

  vectorWrapper: {
    position: 'relative',
  },

  shadow: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.28)',
  },

  hairBack: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#111111',
  },

  head: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#111111',
    zIndex: 3,
  },

  hairFront: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#111111',
    zIndex: 4,
  },

  spike: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#111111',
    zIndex: 5,
  },

  eye: {
    position: 'absolute',
    backgroundColor: '#111111',
  },

  mouth: {
    position: 'absolute',
    backgroundColor: '#7A3A2A',
  },

  neck: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#111111',
    zIndex: 1,
  },

  arm: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#111111',
    borderRadius: 4,
    zIndex: 1,
  },

  torso: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#111111',
    zIndex: 2,
  },

  hoodiePocket: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },

  jacketLine: {
    position: 'absolute',
    width: 2,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  leg: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#111111',
    borderRadius: 4,
    zIndex: 1,
  },

  shoe: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#111111',
    zIndex: 2,
  },

  cap: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#111111',
    zIndex: 6,
  },

  glasses: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#111111',
    zIndex: 6,
  },
});

export default AvatarSprite;