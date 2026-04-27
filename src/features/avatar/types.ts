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

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  bodyType: 'masculine',
  skinTone: '#F1B887',
  hairStyle: 'spiky',
  hairColor: '#F6A21A',
  topStyle: 'hoodie',
  topColor: '#FFB020',
  bottomStyle: 'pants',
  bottomColor: '#161616',
  shoeStyle: 'sneakers',
  shoeColor: '#0E0E0E',
  accessory: 'none',
  accessoryColor: '#FFFFFF',
};

export const defaultAvatarConfig = DEFAULT_AVATAR_CONFIG;

export const BODY_TYPE_OPTIONS: AvatarOption[] = [
  {id: 'masculine', label: 'Masculino'},
  {id: 'feminine', label: 'Femenino'},
];

export const HAIR_STYLE_OPTIONS: AvatarOption[] = [
  {id: 'spiky', label: 'Puntas'},
  {id: 'short', label: 'Corto'},
  {id: 'bob', label: 'Bob'},
  {id: 'long', label: 'Largo'},
];

export const TOP_OPTIONS: AvatarOption[] = [
  {id: 'shirt', label: 'Polera'},
  {id: 'hoodie', label: 'Polerón'},
  {id: 'jacket', label: 'Chaqueta'},
];

export const BOTTOM_OPTIONS: AvatarOption[] = [
  {id: 'shorts', label: 'Short'},
  {id: 'pants', label: 'Pantalón'},
  {id: 'cargo', label: 'Cargo'},
];

export const SHOES_OPTIONS: AvatarOption[] = [
  {id: 'sneakers', label: 'Zapatillas'},
  {id: 'boots', label: 'Botines'},
];

export const ACCESSORY_OPTIONS: AvatarOption[] = [
  {id: 'none', label: 'Sin accesorio'},
  {id: 'cap', label: 'Gorra'},
  {id: 'glasses', label: 'Lentes'},
];

export const AVATAR_COLOR_PALETTE = [
  '#FF6B52',
  '#FFB020',
  '#29D3D3',
  '#6F4CFF',
  '#2F80ED',
  '#27AE60',
  '#F299C1',
  '#F2F2F2',
  '#111111',
];

export const SKIN_TONE_PALETTE = [
  '#F7C59F',
  '#E8A06A',
  '#C9824D',
  '#8F563B',
  '#5E3728',
];

export const HAIR_COLOR_PALETTE = [
  '#F6A21A',
  '#FFD84A',
  '#7B3F20',
  '#111111',
  '#EDEDED',
];