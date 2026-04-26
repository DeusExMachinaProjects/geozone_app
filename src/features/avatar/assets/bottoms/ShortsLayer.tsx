import React from 'react';
import {G, Path, Rect} from 'react-native-svg';
import {AvatarBodyType} from '../../types';

type Props = {
  bodyType: AvatarBodyType;
  color: string;
};

export function ShortsLayer({bodyType, color}: Props) {
  const waistY = bodyType === 'female' ? 149 : 147;
  const hipWidth = bodyType === 'female' ? 52 : 58;

  return (
    <G>
      <Rect
        x={100 - hipWidth / 2}
        y={waistY}
        width={hipWidth}
        height="15"
        rx="7"
        fill={color}
      />

      <Path
        d="M77 160 Q86 159 94 162 L92 187 Q85 191 78 186 Z"
        fill={color}
      />
      <Path
        d="M123 160 Q114 159 106 162 L108 187 Q115 191 122 186 Z"
        fill={color}
      />

      <Path
        d="M94 162 L94 184 Q100 188 106 184 L106 162 Z"
        fill={color}
      />

      <Path
        d="M80 186 Q86 190 92 186"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <Path
        d="M108 186 Q114 190 120 186"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </G>
  );
}