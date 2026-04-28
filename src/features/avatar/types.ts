import type {ImageSourcePropType} from 'react-native';

export type AvatarDirection = 'front' | 'right' | 'back' | 'left';

export type AvatarBodyType = 'masculine' | 'feminine';

export type AvatarHairStyle =
  | 'spiky'
  | 'messy'
  | 'bob'
  | 'ponytail'
  | 'twin_bun'
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
};

export type AvatarLayerImages = Record<AvatarDirection, ImageSourcePropType>;

export type AvatarCatalogItem<T extends string> = {
  id: T;
  label: string;
  previewDirection?: AvatarDirection;
};