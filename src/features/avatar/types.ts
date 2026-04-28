export type AvatarDirection = 'front' | 'right' | 'back' | 'left';

export type AvatarBodyType = 'masculine' | 'feminine';

export type AvatarHairStyle =
  | 'spiky'
  | 'messy'
  | 'bob'
  | 'ponytail'
  | 'twinBuns'
  | 'braid'
  | 'mohawk';

export type AvatarTopStyle = 'shirt' | 'hoodie' | 'jacket' | 'jersey';

export type AvatarBottomStyle = 'pants' | 'shorts' | 'cargo';

export type AvatarShoesStyle = 'sneakers' | 'boots' | 'running';

export type AvatarAccessoryStyle =
  | 'none'
  | 'cap'
  | 'glasses'
  | 'backpack'
  | 'watch'
  | 'bandana';

export type AvatarConfig = {
  bodyType: AvatarBodyType;
  hairStyle: AvatarHairStyle;
  topStyle: AvatarTopStyle;
  bottomStyle: AvatarBottomStyle;
  shoesStyle: AvatarShoesStyle;
  accessoryStyle: AvatarAccessoryStyle;

  skinTone?: string;
  hairColor?: string;
  topColor?: string;
  bottomColor?: string;
  shoesColor?: string;
  accessoryColor?: string;
};

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  bodyType: 'masculine',
  hairStyle: 'spiky',
  topStyle: 'shirt',
  bottomStyle: 'pants',
  shoesStyle: 'sneakers',
  accessoryStyle: 'none',

  skinTone: '#F2B879',
  hairColor: '#F6A623',
  topColor: '#F6A623',
  bottomColor: '#151515',
  shoesColor: '#FFFFFF',
  accessoryColor: '#E84D3D',
};