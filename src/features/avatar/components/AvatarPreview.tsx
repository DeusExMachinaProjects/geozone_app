import React from 'react';
import {StyleSheet, View} from 'react-native';
import {AvatarConfig, DEFAULT_AVATAR_CONFIG} from '../types';

type AvatarPreviewProps = {
  config?: Partial<AvatarConfig>;
  size?: number;
};

function buildConfig(config?: Partial<AvatarConfig>): AvatarConfig {
  return {
    ...DEFAULT_AVATAR_CONFIG,
    ...(config ?? {}),
    bodyType:
      config?.bodyType === 'feminine' ? 'feminine' : DEFAULT_AVATAR_CONFIG.bodyType,
  };
}

export function AvatarPreview({config, size = 180}: AvatarPreviewProps) {
  const avatar = buildConfig(config);
  const scale = size / 180;

  const px = (value: number) => value * scale;

  const isFeminine = avatar.bodyType === 'feminine';

  return (
    <View
      style={[
        styles.stage,
        {
          width: size,
          height: size,
          borderRadius: px(20),
        },
      ]}>
      <View style={[styles.shadow, {width: px(66), height: px(10), bottom: px(11)}]} />

      <View
        style={[
          styles.avatar,
          {
            width: px(98),
            height: px(152),
          },
        ]}>
        <View
          style={[
            styles.hairBack,
            {
              backgroundColor: avatar.hairColor,
              width: px(isFeminine ? 58 : 54),
              height: px(isFeminine ? 58 : 44),
              borderRadius: px(18),
              top: px(4),
              left: px(isFeminine ? 20 : 22),
            },
          ]}
        />

        <View
          style={[
            styles.head,
            {
              backgroundColor: avatar.skinTone,
              width: px(46),
              height: px(48),
              borderRadius: px(15),
              top: px(16),
              left: px(26),
            },
          ]}>
          <View style={[styles.eye, {left: px(12), top: px(21)}]} />
          <View style={[styles.eye, {right: px(12), top: px(21)}]} />
          <View style={[styles.mouth, {top: px(34), left: px(20)}]} />
        </View>

        <View
          style={[
            styles.hairFront,
            {
              backgroundColor: avatar.hairColor,
              width: px(56),
              height: px(24),
              borderRadius: px(12),
              top: px(10),
              left: px(21),
            },
          ]}
        />

        {avatar.hairStyle === 'spiky' && (
          <>
            <View
              style={[
                styles.spike,
                {
                  backgroundColor: avatar.hairColor,
                  left: px(18),
                  top: px(2),
                  transform: [{rotate: '-28deg'}],
                },
              ]}
            />
            <View
              style={[
                styles.spike,
                {
                  backgroundColor: avatar.hairColor,
                  left: px(40),
                  top: px(-3),
                  transform: [{rotate: '4deg'}],
                },
              ]}
            />
            <View
              style={[
                styles.spike,
                {
                  backgroundColor: avatar.hairColor,
                  right: px(18),
                  top: px(2),
                  transform: [{rotate: '28deg'}],
                },
              ]}
            />
          </>
        )}

        {avatar.accessory === 'cap' && (
          <View
            style={[
              styles.cap,
              {
                backgroundColor: avatar.accessoryColor,
                width: px(56),
                height: px(16),
                borderRadius: px(8),
                top: px(8),
                left: px(21),
              },
            ]}
          />
        )}

        {avatar.accessory === 'glasses' && (
          <View
            style={[
              styles.glasses,
              {
                width: px(34),
                height: px(10),
                top: px(39),
                left: px(32),
              },
            ]}
          />
        )}

        <View
          style={[
            styles.neck,
            {
              backgroundColor: avatar.skinTone,
              width: px(18),
              height: px(16),
              top: px(61),
              left: px(40),
            },
          ]}
        />

        <View
          style={[
            styles.arm,
            {
              backgroundColor: avatar.skinTone,
              width: px(16),
              height: px(48),
              top: px(82),
              left: px(11),
            },
          ]}
        />
        <View
          style={[
            styles.arm,
            {
              backgroundColor: avatar.skinTone,
              width: px(16),
              height: px(48),
              top: px(82),
              right: px(11),
            },
          ]}
        />

        <View
          style={[
            styles.torso,
            {
              backgroundColor: avatar.topColor,
              width: px(isFeminine ? 50 : 56),
              height: px(56),
              borderRadius: px(10),
              top: px(72),
              left: px(isFeminine ? 24 : 21),
            },
          ]}>
          {avatar.topStyle === 'hoodie' && (
            <>
              <View style={[styles.hoodLine, {left: px(13)}]} />
              <View style={[styles.hoodLine, {right: px(13)}]} />
              <View
                style={[
                  styles.pocket,
                  {
                    width: px(24),
                    height: px(9),
                    borderRadius: px(5),
                    left: px(16),
                    bottom: px(8),
                  },
                ]}
              />
            </>
          )}

          {avatar.topStyle === 'jacket' && (
            <View
              style={[
                styles.jacketLine,
                {
                  left: px(27),
                  height: px(48),
                },
              ]}
            />
          )}
        </View>

        <View
          style={[
            styles.leg,
            {
              backgroundColor: avatar.bottomColor,
              width: px(18),
              height: px(40),
              top: px(124),
              left: px(29),
            },
          ]}
        />
        <View
          style={[
            styles.leg,
            {
              backgroundColor: avatar.bottomColor,
              width: px(18),
              height: px(40),
              top: px(124),
              right: px(29),
            },
          ]}
        />

        <View
          style={[
            styles.shoe,
            {
              backgroundColor: avatar.shoeColor,
              width: px(23),
              height: px(10),
              top: px(160),
              left: px(24),
            },
          ]}
        />
        <View
          style={[
            styles.shoe,
            {
              backgroundColor: avatar.shoeColor,
              width: px(23),
              height: px(10),
              top: px(160),
              right: px(24),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.055)',
    overflow: 'hidden',
  },
  avatar: {
    position: 'relative',
  },
  shadow: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.32)',
    transform: [{scaleX: 1.25}],
  },
  hairBack: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.42)',
  },
  head: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.55)',
    zIndex: 4,
  },
  hairFront: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.45)',
    zIndex: 5,
  },
  spike: {
    position: 'absolute',
    width: 18,
    height: 28,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.45)',
    zIndex: 6,
  },
  eye: {
    position: 'absolute',
    width: 5,
    height: 7,
    borderRadius: 2,
    backgroundColor: '#101114',
  },
  mouth: {
    position: 'absolute',
    width: 8,
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  neck: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.35)',
    zIndex: 2,
  },
  arm: {
    position: 'absolute',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.45)',
    zIndex: 1,
  },
  torso: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.55)',
    zIndex: 3,
  },
  hoodLine: {
    position: 'absolute',
    top: 6,
    width: 2,
    height: 18,
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
  pocket: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  jacketLine: {
    position: 'absolute',
    top: 4,
    width: 2,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  leg: {
    position: 'absolute',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.55)',
    zIndex: 2,
  },
  shoe: {
    position: 'absolute',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.55)',
    zIndex: 3,
  },
  cap: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.5)',
    zIndex: 8,
  },
  glasses: {
    position: 'absolute',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#111111',
    zIndex: 8,
  },
});