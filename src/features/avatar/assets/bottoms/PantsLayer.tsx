import React from 'react';
import {G, Path, Rect} from 'react-native-svg';
import {AvatarBodyType} from '../../types';

type Props = {
  bodyType: AvatarBodyType;
  color: string;
};

export function PantsLayer({bodyType, color}: Props) {
  const waistY = bodyType === 'female' ? 149 : 147;
  const hipWidth = bodyType === 'female' ? 52 : 58;

  return (
    <G>
      <Rect
        x={100 - hipWidth / 2}
        y={waistY}
        width={hipWidth}
        height="16"
        rx="7"
        fill={color}
      />

      <Path
        d="M78 160 Q86 158 92 162 L91 224 Q86 226 80 223 Q78 214 78 191 Z"
        fill={color}
      />
      <Path
        d="M122 160 Q114 158 108 162 L109 224 Q114 226 120 223 Q122 214 122 191 Z"
        fill={color}
      />

      <Path
        d="M92 161 Q96 165 96 175 L96 224 L104 224 L104 175 Q104 165 108 161 Z"
        fill={color}
      />

      <Path
        d="M99 160 L99 223"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <Path
        d="M101 160 L101 223"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </G>
  );
}