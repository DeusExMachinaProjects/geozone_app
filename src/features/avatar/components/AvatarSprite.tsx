import React from 'react';
import {StyleSheet, View} from 'react-native';
import type {AvatarConfig, AvatarFacing} from '../types';

type AvatarSpriteProps = {
  config: AvatarConfig;
  facing?: AvatarFacing;
  size?: number;
};

const dark = '#101116';
const outline = '#07080A';
const skinShadow = 'rgba(80,35,20,0.34)';
const white = '#F7F8FA';

export function AvatarSprite({config, facing = 'front', size = 160}: AvatarSpriteProps) {
  const s = size / 160;
  const px = (value: number) => Math.round(value * s);
  const isBack = facing === 'back';
  const isSide = facing === 'left' || facing === 'right';
  const flip = facing === 'left' ? [{scaleX: -1}] : undefined;

  const headWidth = isSide ? 43 : 50;
  const headLeft = isSide ? 61 : 55;
  const bodyTypeMod = config.bodyType === 'feminine' ? -5 : 0;

  return (
    <View style={[styles.wrap, {width: size, height: px(210)}]} pointerEvents="none">
      <View style={[styles.shadow, {width: px(78), height: px(14), bottom: px(6)}]} />

      <View style={[styles.sprite, {width: size, height: px(200), transform: flip}]}>        
        {config.accessory === 'backpack' && !isSide ? (
          <View
            style={[
              styles.backpack,
              {
                left: px(58),
                top: px(86),
                width: px(44),
                height: px(58),
                backgroundColor: config.accessoryColor,
                borderWidth: px(3),
                borderRadius: px(8),
              },
            ]}
          />
        ) : null}

        <View
          style={[
            styles.neck,
            {
              left: px(72),
              top: px(67),
              width: px(16),
              height: px(18),
              backgroundColor: config.skinTone,
              borderWidth: px(2),
            },
          ]}
        />

        <View
          style={[
            styles.head,
            {
              left: px(headLeft),
              top: px(26),
              width: px(headWidth),
              height: px(48),
              backgroundColor: config.skinTone,
              borderWidth: px(3),
              borderRadius: px(14),
            },
          ]}>
          {!isBack && (
            <>
              <View
                style={[
                  styles.eye,
                  {
                    left: px(isSide ? 24 : 11),
                    top: px(20),
                    width: px(6),
                    height: px(9),
                    borderRadius: px(2),
                  },
                ]}
              />
              {!isSide && (
                <View
                  style={[
                    styles.eye,
                    {
                      right: px(11),
                      top: px(20),
                      width: px(6),
                      height: px(9),
                      borderRadius: px(2),
                    },
                  ]}
                />
              )}
              <View
                style={[
                  styles.mouth,
                  {
                    left: px(isSide ? 27 : 22),
                    top: px(34),
                    width: px(isSide ? 6 : 8),
                    height: px(2),
                  },
                ]}
              />
            </>
          )}
          <View
            style={[
              styles.faceShade,
              {
                right: px(4),
                bottom: px(4),
                width: px(12),
                height: px(10),
                backgroundColor: skinShadow,
              },
            ]}
          />
        </View>

        <HairShape
          styleId={config.hairStyle}
          color={config.hairColor}
          facing={facing}
          px={px}
          isSide={isSide}
          isBack={isBack}
        />

        {config.accessory === 'cap' ? (
          <View
            style={[
              styles.cap,
              {
                left: px(isSide ? 56 : 51),
                top: px(22),
                width: px(isSide ? 47 : 58),
                height: px(18),
                backgroundColor: config.accessoryColor,
                borderWidth: px(3),
              },
            ]}
          />
        ) : null}

        {config.accessory === 'glasses' && !isBack ? (
          <View
            style={[
              styles.glasses,
              {
                left: px(isSide ? 78 : 65),
                top: px(47),
                width: px(isSide ? 16 : 30),
                height: px(10),
                borderWidth: px(2),
                borderColor: config.accessoryColor,
              },
            ]}
          />
        ) : null}

        <View
          style={[
            styles.torso,
            {
              left: px(49 - bodyTypeMod / 2),
              top: px(80),
              width: px(62 + bodyTypeMod),
              height: px(57),
              backgroundColor: config.topColor,
              borderWidth: px(3),
              borderRadius: px(config.topStyle === 'hoodie' ? 9 : 5),
            },
          ]}>
          <View
            style={[
              styles.torsoHighlight,
              {
                left: px(11),
                top: px(9),
                width: px(32 + bodyTypeMod),
                height: px(8),
                backgroundColor: 'rgba(255,255,255,0.20)',
              },
            ]}
          />
          {config.topStyle === 'jersey' ? (
            <View
              style={[
                styles.jerseyNumber,
                {left: px(26), top: px(22), width: px(10), height: px(16), backgroundColor: white},
              ]}
            />
          ) : null}
          {config.topStyle === 'jacket' ? (
            <View style={[styles.zip, {left: px(30), top: px(6), width: px(3), height: px(45)}]} />
          ) : null}
        </View>

        {config.topStyle === 'hoodie' || config.topStyle === 'jacket' ? (
          <View
            style={[
              styles.hood,
              {
                left: px(54),
                top: px(74),
                width: px(52),
                height: px(23),
                borderWidth: px(3),
                borderColor: outline,
                backgroundColor: config.topColor,
              },
            ]}
          />
        ) : null}

        <View
          style={[
            styles.arm,
            {
              left: px(35),
              top: px(86),
              width: px(17),
              height: px(51),
              backgroundColor: config.topColor,
              borderWidth: px(3),
            },
          ]}
        />
        <View
          style={[
            styles.arm,
            {
              right: px(35),
              top: px(86),
              width: px(17),
              height: px(51),
              backgroundColor: config.topColor,
              borderWidth: px(3),
            },
          ]}
        />

        <View
          style={[
            styles.hand,
            {
              left: px(36),
              top: px(132),
              width: px(14),
              height: px(14),
              backgroundColor: config.skinTone,
              borderWidth: px(2),
            },
          ]}
        />
        <View
          style={[
            styles.hand,
            {
              right: px(36),
              top: px(132),
              width: px(14),
              height: px(14),
              backgroundColor: config.skinTone,
              borderWidth: px(2),
            },
          ]}
        />

        <View
          style={[
            styles.waist,
            {left: px(54), top: px(132), width: px(52), height: px(21), backgroundColor: config.bottomColor, borderWidth: px(3)},
          ]}
        />

        <View
          style={[
            styles.leg,
            {
              left: px(55),
              top: px(151),
              width: px(config.bottomStyle === 'leggings' ? 19 : 21),
              height: px(config.bottomStyle === 'shorts' ? 28 : 40),
              backgroundColor: config.bottomStyle === 'shorts' ? config.skinTone : config.bottomColor,
              borderWidth: px(3),
            },
          ]}
        />
        <View
          style={[
            styles.leg,
            {
              right: px(55),
              top: px(151),
              width: px(config.bottomStyle === 'leggings' ? 19 : 21),
              height: px(config.bottomStyle === 'shorts' ? 28 : 40),
              backgroundColor: config.bottomStyle === 'shorts' ? config.skinTone : config.bottomColor,
              borderWidth: px(3),
            },
          ]}
        />

        {config.bottomStyle === 'cargo' ? (
          <>
            <View style={[styles.cargoPocket, {left: px(53), top: px(147), width: px(14), height: px(11)}]} />
            <View style={[styles.cargoPocket, {right: px(53), top: px(147), width: px(14), height: px(11)}]} />
          </>
        ) : null}

        <View
          style={[
            styles.shoe,
            {
              left: px(47),
              top: px(config.bottomStyle === 'shorts' ? 176 : 188),
              width: px(33),
              height: px(15),
              backgroundColor: config.shoeColor,
              borderWidth: px(3),
            },
          ]}
        />
        <View
          style={[
            styles.shoe,
            {
              right: px(47),
              top: px(config.bottomStyle === 'shorts' ? 176 : 188),
              width: px(33),
              height: px(15),
              backgroundColor: config.shoeColor,
              borderWidth: px(3),
            },
          ]}
        />

        {config.accessory === 'watch' ? (
          <View
            style={[
              styles.watch,
              {
                right: px(32),
                top: px(130),
                width: px(12),
                height: px(8),
                backgroundColor: config.accessoryColor,
                borderWidth: px(2),
              },
            ]}
          />
        ) : null}

        {config.accessory === 'bandana' ? (
          <View
            style={[
              styles.bandana,
              {
                left: px(61),
                top: px(75),
                width: px(38),
                height: px(12),
                backgroundColor: config.accessoryColor,
                borderWidth: px(2),
              },
            ]}
          />
        ) : null}
      </View>
    </View>
  );
}

type HairShapeProps = {
  styleId: string;
  color: string;
  facing: AvatarFacing;
  px: (value: number) => number;
  isSide: boolean;
  isBack: boolean;
};

function HairShape({styleId, color, px, isSide, isBack}: HairShapeProps) {
  const sideLeft = isSide ? 55 : 50;

  return (
    <>
      <View
        style={[
          styles.hairBase,
          {
            left: px(sideLeft),
            top: px(16),
            width: px(isSide ? 52 : 60),
            height: px(isBack ? 59 : 36),
            backgroundColor: color,
            borderWidth: px(3),
            borderRadius: px(styleId === 'bob' || styleId === 'braid' ? 18 : 8),
          },
        ]}
      />

      {(styleId === 'spiky' || styleId === 'messy') && (
        <>
          <Spike left={52} top={13} width={20} height={25} color={color} px={px} rotate="-25deg" />
          <Spike left={67} top={8} width={24} height={28} color={color} px={px} rotate="4deg" />
          <Spike left={87} top={12} width={21} height={25} color={color} px={px} rotate="25deg" />
          <Spike left={45} top={28} width={19} height={19} color={color} px={px} rotate="-45deg" />
        </>
      )}

      {styleId === 'mohawk' && (
        <>
          <View style={[styles.mohawk, {left: px(68), top: px(5), width: px(22), height: px(42), backgroundColor: color, borderWidth: px(3)}]} />
          <View style={[styles.sideFade, {left: px(54), top: px(31), width: px(15), height: px(23), backgroundColor: '#2B292C'}]} />
        </>
      )}

      {styleId === 'pony' && (
        <View
          style={[
            styles.pony,
            {right: px(isSide ? 39 : 35), top: px(39), width: px(22), height: px(55), backgroundColor: color, borderWidth: px(3)},
          ]}
        />
      )}

      {styleId === 'buns' && (
        <>
          <View style={[styles.bun, {left: px(40), top: px(29), width: px(22), height: px(22), backgroundColor: color, borderWidth: px(3)}]} />
          <View style={[styles.bun, {right: px(40), top: px(29), width: px(22), height: px(22), backgroundColor: color, borderWidth: px(3)}]} />
        </>
      )}

      {styleId === 'braid' && (
        <>
          <View style={[styles.braid, {right: px(43), top: px(54), width: px(18), height: px(54), backgroundColor: color, borderWidth: px(3)}]} />
          <View style={[styles.braidTip, {right: px(48), top: px(103), width: px(13), height: px(13), backgroundColor: color, borderWidth: px(2)}]} />
        </>
      )}

      <View style={[styles.hairShine, {left: px(68), top: px(23), width: px(20), height: px(5)}]} />
    </>
  );
}

function Spike({left, top, width, height, color, px, rotate}: {left: number; top: number; width: number; height: number; color: string; px: (value: number) => number; rotate: string}) {
  return (
    <View
      style={[
        styles.spike,
        {
          left: px(left),
          top: px(top),
          width: px(width),
          height: px(height),
          backgroundColor: color,
          borderWidth: px(3),
          transform: [{rotate}],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  sprite: {
    position: 'relative',
  },
  shadow: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.32)',
    borderRadius: 999,
  },
  head: {
    position: 'absolute',
    borderColor: outline,
    overflow: 'hidden',
  },
  neck: {
    position: 'absolute',
    borderColor: outline,
    zIndex: 1,
  },
  eye: {
    position: 'absolute',
    backgroundColor: dark,
    zIndex: 8,
  },
  mouth: {
    position: 'absolute',
    backgroundColor: '#7A382A',
    zIndex: 8,
  },
  faceShade: {
    position: 'absolute',
    borderRadius: 999,
  },
  hairBase: {
    position: 'absolute',
    borderColor: outline,
    zIndex: 4,
  },
  spike: {
    position: 'absolute',
    borderColor: outline,
    zIndex: 5,
  },
  mohawk: {
    position: 'absolute',
    borderColor: outline,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    zIndex: 7,
  },
  sideFade: {
    position: 'absolute',
    borderRadius: 6,
    zIndex: 6,
  },
  pony: {
    position: 'absolute',
    borderColor: outline,
    borderRadius: 12,
    zIndex: 2,
  },
  bun: {
    position: 'absolute',
    borderColor: outline,
    borderRadius: 999,
    zIndex: 6,
  },
  braid: {
    position: 'absolute',
    borderColor: outline,
    borderRadius: 10,
    zIndex: 2,
  },
  braidTip: {
    position: 'absolute',
    borderColor: outline,
    borderRadius: 4,
    zIndex: 2,
  },
  hairShine: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 999,
    zIndex: 9,
  },
  cap: {
    position: 'absolute',
    borderColor: outline,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    zIndex: 12,
  },
  glasses: {
    position: 'absolute',
    borderRadius: 7,
    zIndex: 13,
  },
  backpack: {
    position: 'absolute',
    borderColor: outline,
    zIndex: 0,
  },
  torso: {
    position: 'absolute',
    borderColor: outline,
    overflow: 'hidden',
    zIndex: 2,
  },
  torsoHighlight: {
    position: 'absolute',
    borderRadius: 999,
  },
  jerseyNumber: {
    position: 'absolute',
    borderRadius: 2,
  },
  zip: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.70)',
  },
  hood: {
    position: 'absolute',
    borderBottomWidth: 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    zIndex: 1,
  },
  arm: {
    position: 'absolute',
    borderColor: outline,
    borderRadius: 8,
    zIndex: 1,
  },
  hand: {
    position: 'absolute',
    borderColor: outline,
    borderRadius: 6,
    zIndex: 3,
  },
  waist: {
    position: 'absolute',
    borderColor: outline,
    borderRadius: 5,
    zIndex: 3,
  },
  leg: {
    position: 'absolute',
    borderColor: outline,
    borderRadius: 6,
    zIndex: 2,
  },
  cargoPocket: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.45)',
    borderRadius: 3,
    zIndex: 4,
  },
  shoe: {
    position: 'absolute',
    borderColor: outline,
    borderRadius: 8,
    zIndex: 5,
  },
  watch: {
    position: 'absolute',
    borderColor: outline,
    borderRadius: 4,
    zIndex: 10,
  },
  bandana: {
    position: 'absolute',
    borderColor: outline,
    borderRadius: 7,
    zIndex: 10,
  },
});
