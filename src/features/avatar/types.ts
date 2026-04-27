export type AvatarBodyType = 'masculine' | 'feminine';

export type AvatarFacing = 'front' | 'profile' | 'back';

export type AvatarCategory =
  | 'hair'
  | 'face'
  | 'top'
  | 'bottom'
  | 'shoes'
  | 'accessories';

export type AvatarOption = {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  locked?: boolean;
  bodyTypes?: AvatarBodyType[];
};

export type AvatarConfig = {
  bodyType: AvatarBodyType;
  skinTone: string;

  hairStyle: string;
  hairColor: string;

  topStyle: string;
  topColor: string;

  bottomStyle: string;
  bottomColor: string;

  shoeStyle: string;
  shoeColor: string;

  accessory: string;
  accessoryColor: string;
};

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  bodyType: 'masculine',
  skinTone: '#F2B68B',

  hairStyle: 'spiky',
  hairColor: '#F5C84B',

  topStyle: 'shirt',
  topColor: '#00C2D7',

  bottomStyle: 'pants',
  bottomColor: '#3A6EA5',

  shoeStyle: 'sneakers',
  shoeColor: '#F7F7F7',

  accessory: 'none',
  accessoryColor: '#FFB703',
};

export const defaultAvatarConfig = DEFAULT_AVATAR_CONFIG;