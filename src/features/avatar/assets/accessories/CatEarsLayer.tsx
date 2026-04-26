import React from 'react';
import {G, Path} from 'react-native-svg';

type Props = {
  color: string;
};

export function CatEarsLayer({color}: Props) {
  return (
    <G>
      <Path d="M82 38 L90 22 L97 39 Z" fill={color} />
      <Path d="M118 38 L110 22 L103 39 Z" fill={color} />

      <Path d="M87 35 L90 28 L94 36 Z" fill="rgba(255,255,255,0.22)" />
      <Path d="M113 35 L110 28 L106 36 Z" fill="rgba(255,255,255,0.22)" />
    </G>
  );
}