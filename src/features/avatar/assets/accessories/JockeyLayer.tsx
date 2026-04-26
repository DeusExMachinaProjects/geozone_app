import React from 'react';
import {Ellipse, G, Path} from 'react-native-svg';

type Props = {
  color: string;
};

export function JockeyLayer({color}: Props) {
  return (
    <G>
      <Path
        d="M80 40 Q88 28 100 28 Q112 28 120 40 Q112 44 100 44 Q88 44 80 40 Z"
        fill={color}
      />
      <Ellipse cx="100" cy="39" rx="20" ry="8" fill={color} />
      <Path
        d="M112 40 Q123 42 130 47 Q122 51 111 49 Z"
        fill={color}
      />
      <Path
        d="M85 38 Q100 32 115 38"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </G>
  );
}