import React from 'react';
import {G, Path} from 'react-native-svg';
import {AvatarBodyType} from '../../types';

type Props = {
  bodyType: AvatarBodyType;
  color: string;
};

export function TShirtLayer({bodyType, color}: Props) {
  const bodyPath =
    bodyType === 'male'
      ? 'M73 83 Q100 76 127 83 L134 101 L130 150 Q118 159 100 160 Q82 159 70 150 L66 101 Z'
      : bodyType === 'female'
        ? 'M76 84 Q100 77 124 84 L130 101 L127 150 Q116 160 100 161 Q84 160 73 150 L70 101 Z'
        : 'M74 83.5 Q100 76.5 126 83.5 L132 101 L128 150 Q117 159.5 100 160.5 Q83 159.5 72 150 L68 101 Z';

  return (
    <G>
      <Path d="M73 83 L59 95 L62 114 L70 109 L71 92 Z" fill={color} />
      <Path d="M127 83 L141 95 L138 114 L130 109 L129 92 Z" fill={color} />

      <Path d={bodyPath} fill={color} />

      <Path
        d="M88 81 Q100 88 112 81 Q110 92 100 93 Q90 92 88 81 Z"
        fill="rgba(255,255,255,0.14)"
      />
    </G>
  );
}