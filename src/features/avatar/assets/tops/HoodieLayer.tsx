import React from 'react';
import {G, Path, Rect} from 'react-native-svg';
import {AvatarBodyType} from '../../types';

type Props = {
  bodyType: AvatarBodyType;
  color: string;
};

export function HoodieLayer({bodyType, color}: Props) {
  const bodyPath =
    bodyType === 'male'
      ? 'M70 82 Q100 74 130 82 L138 100 L134 154 Q120 166 100 167 Q80 166 66 154 L62 100 Z'
      : bodyType === 'female'
        ? 'M74 83 Q100 76 126 83 L134 100 L130 154 Q118 165 100 166 Q82 165 70 154 L66 100 Z'
        : 'M72 82.5 Q100 75 128 82.5 L136 100 L132 154 Q119 165.5 100 166.5 Q81 165.5 68 154 L64 100 Z';

  return (
    <G>
      <Path
        d="M77 58 Q88 48 100 48 Q112 48 123 58 L118 82 Q110 74 100 74 Q90 74 82 82 Z"
        fill={color}
      />

      <Path d="M70 82 L56 95 L60 122 L68 116 L69 92 Z" fill={color} />
      <Path d="M130 82 L144 95 L140 122 L132 116 L131 92 Z" fill={color} />

      <Path d={bodyPath} fill={color} />

      <Path
        d="M88 79 Q100 87 112 79 Q111 95 100 96 Q89 95 88 79 Z"
        fill="rgba(255,255,255,0.10)"
      />

      <Rect
        x="87"
        y="133"
        width="26"
        height="16"
        rx="7"
        fill="rgba(255,255,255,0.12)"
      />

      <Path
        d="M95 84 L93 101"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <Path
        d="M105 84 L107 101"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </G>
  );
}