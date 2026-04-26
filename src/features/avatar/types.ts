export const BODY_TYPES = ['male', 'female'] as const;
export type AvatarBodyType = (typeof BODY_TYPES)[number];

export const ACCESSORY_TYPES = ['none', 'jockey', 'cat_ears'] as const;
export type AvatarAccessoryType = (typeof ACCESSORY_TYPES)[number];

export const TOP_TYPES = ['tshirt', 'hoodie'] as const;
export type AvatarTopType = (typeof TOP_TYPES)[number];

export const BOTTOM_TYPES = ['pants', 'shorts'] as const;
export type AvatarBottomType = (typeof BOTTOM_TYPES)[number];

export const AVATAR_COLOR_KEYS = [
  'black',
  'white',
  'gray',
  'red',
  'blue',
  'cyan',
  'green',
  'yellow',
  'orange',
  'purple',
  'pink',
] as const;
export type AvatarColorKey = (typeof AVATAR_COLOR_KEYS)[number];

export type AvatarConfig = {
  bodyType: AvatarBodyType;
  accessory: AvatarAccessoryType;
  top: AvatarTopType;
  bottom: AvatarBottomType;
  topColor: AvatarColorKey;
  bottomColor: AvatarColorKey;
  accessoryColor: AvatarColorKey;
};

export type AvatarOption<T extends string> = {
  label: string;
  value: T;
};

export const BODY_TYPE_OPTIONS: AvatarOption<AvatarBodyType>[] = [
  {label: 'Hombre', value: 'male'},
  {label: 'Mujer', value: 'female'},
];

export const ACCESSORY_OPTIONS: AvatarOption<AvatarAccessoryType>[] = [
  {label: 'Sin accesorio', value: 'none'},
  {label: 'Jockey', value: 'jockey'},
  {label: 'Orejas de gato', value: 'cat_ears'},
];

export const TOP_OPTIONS: AvatarOption<AvatarTopType>[] = [
  {label: 'Polera', value: 'tshirt'},
  {label: 'Polerón', value: 'hoodie'},
];

export const BOTTOM_OPTIONS: AvatarOption<AvatarBottomType>[] = [
  {label: 'Pantalón', value: 'pants'},
  {label: 'Short', value: 'shorts'},
];

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  bodyType: 'male',
  accessory: 'none',
  top: 'hoodie',
  bottom: 'pants',
  topColor: 'orange',
  bottomColor: 'black',
  accessoryColor: 'white',
};