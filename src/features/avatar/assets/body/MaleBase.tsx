import React from 'react';
import {Circle, Ellipse, G, Path} from 'react-native-svg';

export function MaleBase() {
  return (
    <G>
      <Ellipse cx="100" cy="226" rx="44" ry="10" fill="rgba(0,0,0,0.15)" />

      <Path
        d="M78 39 Q82 22 100 22 Q118 22 122 39 Q118 31 109 28 Q104 26 100 26 Q96 26 91 28 Q82 31 78 39 Z"
        fill="#2A201D"
      />

      <Circle cx="100" cy="47" r="21" fill="#E5BC9D" />

      <Ellipse cx="92" cy="47" rx="1.6" ry="1.4" fill="#3B2B25" />
      <Ellipse cx="108" cy="47" rx="1.6" ry="1.4" fill="#3B2B25" />
      <Path d="M96 56 Q100 58 104 56" stroke="#B97E63" strokeWidth="1.8" />

      <Path d="M94 66 Q100 72 106 66 L105 80 Q100 83 95 80 Z" fill="#E5BC9D" />

      <Path
        d="M60 95 Q53 108 55 125 Q56 139 63 146 Q68 150 72 146 Q75 143 73 136 Q69 124 70 110 Q70 102 73 96 Z"
        fill="#E5BC9D"
      />
      <Path
        d="M140 95 Q147 108 145 125 Q144 139 137 146 Q132 150 128 146 Q125 143 127 136 Q131 124 130 110 Q130 102 127 96 Z"
        fill="#E5BC9D"
      />

      <Ellipse cx="69" cy="148" rx="6" ry="4.5" fill="#E5BC9D" />
      <Ellipse cx="131" cy="148" rx="6" ry="4.5" fill="#E5BC9D" />

      <Path
        d="M86 182 Q92 186 92 194 L90 221 Q86 225 80 223 Q78 216 80 198 Q81 187 86 182 Z"
        fill="#E5BC9D"
      />
      <Path
        d="M114 182 Q108 186 108 194 L110 221 Q114 225 120 223 Q122 216 120 198 Q119 187 114 182 Z"
        fill="#E5BC9D"
      />

      <Ellipse cx="84" cy="228" rx="12" ry="5.5" fill="#2C2C2C" />
      <Ellipse cx="116" cy="228" rx="12" ry="5.5" fill="#2C2C2C" />
    </G>
  );
}