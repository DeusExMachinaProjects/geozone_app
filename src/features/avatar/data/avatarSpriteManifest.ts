import {ImageSourcePropType} from 'react-native';
import type {AvatarConfig, AvatarFacing} from '../types';

export type AvatarSpriteLayer = {
  key: string;
  source: ImageSourcePropType | null;
  tintColor?: string;
  flipX?: boolean;
  zIndex: number;
};

type DirectionalSpriteSet = {
  front: ImageSourcePropType | null;
  right: ImageSourcePropType | null;
  back: ImageSourcePropType | null;
  left?: ImageSourcePropType | null;
};

type DirectionalResult = {
  source: ImageSourcePropType | null;
  flipX: boolean;
};

/**
 * IMPORTANTE:
 * Por ahora todo está en null para que compile sin romper.
 * Cuando tengas tus PNG transparentes, reemplaza los null por require(...).
 *
 * Ejemplo:
 * front: require('../../../assets/avatar/body/masculine/front.png')
 */

const BODY_BASES: Record<string, DirectionalSpriteSet> = {
  masculine: {
    front: null,
    right: null,
    back: null,
    left: null,
  },
  feminine: {
    front: null,
    right: null,
    back: null,
    left: null,
  },
};

const HAIR_STYLES: Record<string, DirectionalSpriteSet> = {
  spiky: {
    front: null,
    right: null,
    back: null,
    left: null,
  },
  rebel: {
    front: null,
    right: null,
    back: null,
    left: null,
  },
  bob: {
    front: null,
    right: null,
    back: null,
    left: null,
  },
  short: {
    front: null,
    right: null,
    back: null,
    left: null,
  },
  long: {
    front: null,
    right: null,
    back: null,
    left: null,
  },
};

const TOP_STYLES: Record<string, DirectionalSpriteSet> = {
  hoodie: {
    front: null,
    right: null,
    back: null,
    left: null,
  },
  shirt: {
    front: null,
    right: null,
    back: null,
    left: null,
  },
  jacket: {
    front: null,
    right: null,
    back: null,
    left: null,
  },
  jersey: {
    front: null,
    right: null,
    back: null,
    left: null,
  },
};

const BOTTOM_STYLES: Record<string, DirectionalSpriteSet> = {
  pants: {
    front: null,
    right: null,
    back: null,
    left: null,
  },
  shorts: {
    front: null,
    right: null,
    back: null,
    left: null,
  },
  cargo: {
    front: null,
    right: null,
    back: null,
    left: null,
  },
};

const SHOE_STYLES: Record<string, DirectionalSpriteSet> = {
  sneakers: {
    front: null,
    right: null,
    back: null,
    left: null,
  },
  boots: {
    front: null,
    right: null,
    back: null,
    left: null,
  },
  runner: {
    front: null,
    right: null,
    back: null,
    left: null,
  },
};

const ACCESSORY_STYLES: Record<string, DirectionalSpriteSet> = {
  none: {
    front: null,
    right: null,
    back: null,
    left: null,
  },
  cap: {
    front: null,
    right: null,
    back: null,
    left: null,
  },
  glasses: {
    front: null,
    right: null,
    back: null,
    left: null,
  },
  backpack: {
    front: null,
    right: null,
    back: null,
    left: null,
  },
};

function getCatalogItem(
  catalog: Record<string, DirectionalSpriteSet>,
  requestedKey: string,
  fallbackKey: string,
): DirectionalSpriteSet {
  if (catalog[requestedKey]) {
    return catalog[requestedKey];
  }

  if (catalog[fallbackKey]) {
    return catalog[fallbackKey];
  }

  const firstKey = Object.keys(catalog)[0];

  return catalog[firstKey];
}

function resolveDirectionalSource(
  set: DirectionalSpriteSet,
  facing: AvatarFacing,
): DirectionalResult {
  if (facing === 'front') {
    return {
      source: set.front,
      flipX: false,
    };
  }

  if (facing === 'back') {
    return {
      source: set.back,
      flipX: false,
    };
  }

  if (facing === 'right') {
    return {
      source: set.right,
      flipX: false,
    };
  }

  if (set.left) {
    return {
      source: set.left,
      flipX: false,
    };
  }

  return {
    source: set.right,
    flipX: true,
  };
}

export function getAvatarSpriteLayers(
  config: AvatarConfig,
  facing: AvatarFacing,
): AvatarSpriteLayer[] {
  const bodySet = getCatalogItem(
    BODY_BASES,
    config.bodyType,
    'masculine',
  );

  const hairSet = getCatalogItem(
    HAIR_STYLES,
    config.hairStyle,
    'spiky',
  );

  const topSet = getCatalogItem(
    TOP_STYLES,
    config.topStyle,
    'hoodie',
  );

  const bottomSet = getCatalogItem(
    BOTTOM_STYLES,
    config.bottomStyle,
    'pants',
  );

  const shoeSet = getCatalogItem(
    SHOE_STYLES,
    config.shoeStyle,
    'sneakers',
  );

  const accessorySet = getCatalogItem(
    ACCESSORY_STYLES,
    config.accessory,
    'none',
  );

  const body = resolveDirectionalSource(bodySet, facing);
  const hair = resolveDirectionalSource(hairSet, facing);
  const top = resolveDirectionalSource(topSet, facing);
  const bottom = resolveDirectionalSource(bottomSet, facing);
  const shoes = resolveDirectionalSource(shoeSet, facing);
  const accessory = resolveDirectionalSource(accessorySet, facing);

  return [
    {
      key: 'body',
      source: body.source,
      tintColor: config.skinTone,
      flipX: body.flipX,
      zIndex: 1,
    },
    {
      key: 'bottom',
      source: bottom.source,
      tintColor: config.bottomColor,
      flipX: bottom.flipX,
      zIndex: 2,
    },
    {
      key: 'shoes',
      source: shoes.source,
      tintColor: config.shoeColor,
      flipX: shoes.flipX,
      zIndex: 3,
    },
    {
      key: 'top',
      source: top.source,
      tintColor: config.topColor,
      flipX: top.flipX,
      zIndex: 4,
    },
    {
      key: 'hair',
      source: hair.source,
      tintColor: config.hairColor,
      flipX: hair.flipX,
      zIndex: 5,
    },
    {
      key: 'accessory',
      source: accessory.source,
      tintColor: config.accessoryColor,
      flipX: accessory.flipX,
      zIndex: 6,
    },
  ].sort((a, b) => a.zIndex - b.zIndex);
}

export function hasSpriteAssets(layers: AvatarSpriteLayer[]) {
  return layers.some(layer => layer.source !== null);
}