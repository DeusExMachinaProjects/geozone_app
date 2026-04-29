export const AVATAR_LAYER_CANVAS_SIZE = 1254;

export const AVATAR_LAYER_ORDER = [
  'body',
  'bottom',
  'top',
  'shoes',
  'hair',
  'accessory',
] as const;

export type AvatarLayerKey = (typeof AVATAR_LAYER_ORDER)[number];

export const AVATAR_PREVIEW_SIZES = {
  profileCard: 104,
  editor: 196,
  optionCard: 92,
} as const;
