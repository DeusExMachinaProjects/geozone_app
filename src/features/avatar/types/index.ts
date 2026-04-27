export type AvatarBodyType = 'masculine' | 'feminine';
export type AvatarFacing = 'front' | 'right' | 'back' | 'left';

export type AvatarCategory =
  | 'hair'
  | 'face'
  | 'top'
  | 'bottom'
  | 'shoes'
  | 'accessories';

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

export type AvatarOption = {
  id: string;
  label: string;
};
