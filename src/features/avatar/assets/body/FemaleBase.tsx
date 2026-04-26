import React from 'react';
import {Circle, Ellipse, G, Path} from 'react-native-svg';

export function FemaleBase() {
  return (
    <G>
      <Ellipse cx="100" cy="226" rx="44" ry="10" fill="rgba(0,0,0,0.15)" />

      <Path
        d="M74 40 Q78 19 100 19 Q122 19 126 40 Q124 53 116 61 Q110 66 100 66 Q90 66 84 61 Q76 53 74 40 Z"
        fill="#332723"
      />

      <Circle cx="100" cy="47" r="21" fill="#E5BC9D" />

      <Ellipse cx="92" cy="47" rx="1.5" ry="1.4" fill="#3B2B25" />
      <Ellipse cx="108" cy="47" rx="1.5" ry="1.4" fill="#3B2B25" />
      <Path d="M96 56 Q100 59 104 56" stroke="#B97E63" strokeWidth="1.8" />

      <Path d="M94 66 Q100 72 106 66 L105 80 Q100 84 95 80 Z" fill="#E5BC9D" />

      <Path
        d="M62 97 Q56 109 58 125 Q59 138 65 145 Q69 149 73 146 Q76 143 75 136 Q71 123 72 110 Q72 102 75 97 Z"
        fill="#E5BC9D"
      />
      <Path
        d="M138 97 Q144 109 142 125 Q141 138 135 145 Q131 149 127 146 Q124 143 125 136 Q129 123 128 110 Q128 102 125 97 Z"
        fill="#E5BC9D"
      />

      <Ellipse cx="70" cy="147" rx="5.8" ry="4.4" fill="#E5BC9D" />
      <Ellipse cx="130" cy="147" rx="5.8" ry="4.4" fill="#E5BC9D" />

      <Path
        d="M87 183 Q92 187 92 194 L90 221 Q86 225 81 223 Q79 216 81 199 Q82 188 87 183 Z"
        fill="#E5BC9D"
      />
      <Path
        d="M113 183 Q108 187 108 194 L110 221 Q114 225 119 223 Q121 216 119 199 Q118 188 113 183 Z"
        fill="#E5BC9D"
      />

      <Ellipse cx="84" cy="228" rx="12" ry="5.5" fill="#2C2C2C" />
      <Ellipse cx="116" cy="228" rx="12" ry="5.5" fill="#2C2C2C" />
    </G>
  );
}