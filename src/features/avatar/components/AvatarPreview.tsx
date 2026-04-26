import React from 'react';
import {View} from 'react-native';
import Svg, {Rect} from 'react-native-svg';
import {AvatarConfig} from '../types';
import {MaleBase} from '../assets/body/MaleBase';
import {FemaleBase} from '../assets/body/FemaleBase';
import {TShirtLayer} from '../assets/tops/TShirtLayer';
import {HoodieLayer} from '../assets/tops/HoodieLayer';
import {PantsLayer} from '../assets/bottoms/PantsLayer';
import {ShortsLayer} from '../assets/bottoms/ShortsLayer';
import {JockeyLayer} from '../assets/accessories/JockeyLayer';
import {CatEarsLayer} from '../assets/accessories/CatEarsLayer';
import {styles} from './AvatarPreview.styles';

type Props = {
  config: AvatarConfig;
  size?: number;
};

export function AvatarPreview({config, size = 220}: Props) {
  function renderBody() {
    switch (config.bodyType) {
      case 'female':
        return <FemaleBase />;
      case 'male':
      default:
        return <MaleBase />;
    }
  }

  function renderTop() {
    if (config.top === 'hoodie') {
      return <HoodieLayer bodyType={config.bodyType} color={config.topColor} />;
    }

    return <TShirtLayer bodyType={config.bodyType} color={config.topColor} />;
  }

  function renderBottom() {
    if (config.bottom === 'shorts') {
      return <ShortsLayer bodyType={config.bodyType} color={config.bottomColor} />;
    }

    return <PantsLayer bodyType={config.bodyType} color={config.bottomColor} />;
  }

  function renderAccessory() {
    if (config.accessory === 'cap') {
      return <JockeyLayer color={config.accessoryColor} />;
    }

    if (config.accessory === 'cat_ears') {
      return <CatEarsLayer color={config.accessoryColor} />;
    }

    return null;
  }

  return (
    <View style={[styles.wrapper, {width: size, height: size * 1.08}]}>
      <Svg width={size} height={size * 1.08} viewBox="0 0 200 250">
        <Rect
          x="18"
          y="16"
          width="164"
          height="196"
          rx="20"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.08)"
        />

        {renderBody()}
        {renderBottom()}
        {renderTop()}
        {renderAccessory()}
      </Svg>
    </View>
  );
}