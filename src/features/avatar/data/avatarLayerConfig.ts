import type {
  AvatarAccessoryStyle,
  AvatarConfig,
  AvatarDirection,
} from '../types';

export const BASE_SPRITE_CANVAS = 128;

export type AvatarLayerKey =
  | 'body'
  | 'bottom'
  | 'shoes'
  | 'top'
  | 'hair'
  | 'accessory';

export type AvatarLayerPlacement = {
  sizeRatio: number;
  offsetX: number;
  offsetY: number;
};

/**
 * Tamaño del body dentro del preview completo.
 */
export const FULL_PREVIEW_BODY_RATIO = 0.76;

/**
 * Qué tan arriba empieza el body dentro del preview completo.
 */
export const FULL_PREVIEW_BODY_TOP_RATIO = 0.12;

/**
 * AJUSTE FINO EXTRA
 *
 * Cambios sobre la versión anterior:
 * - hair: un poco más arriba
 * - top: un poco más pequeño
 * - shoes: un poco más grandes
 *
 * Objetivo:
 * - despejar mejor la cara
 * - reducir el volumen de la polera
 * - afirmar mejor los zapatos en los pies
 */

const FRONT_PLACEMENTS: Record<AvatarLayerKey, AvatarLayerPlacement> = {
  body: {
    sizeRatio: 1,
    offsetX: 0,
    offsetY: 0,
  },

  hair: {
    sizeRatio: 0.44,
    offsetX: 0,
    offsetY: -0.10,
  },

  top: {
    sizeRatio: 0.47,
    offsetX: 0,
    offsetY: 0.205,
  },

  bottom: {
    sizeRatio: 0.52,
    offsetX: 0,
    offsetY: 0.46,
  },

  shoes: {
    sizeRatio: 0.43,
    offsetX: 0,
    offsetY: 0.74,
  },

  accessory: {
    sizeRatio: 0.36,
    offsetX: 0,
    offsetY: 0.08,
  },
};

const RIGHT_PLACEMENTS: Record<AvatarLayerKey, AvatarLayerPlacement> = {
  body: {
    sizeRatio: 1,
    offsetX: 0,
    offsetY: 0,
  },

  hair: {
    sizeRatio: 0.42,
    offsetX: 0.01,
    offsetY: -0.09,
  },

  top: {
    sizeRatio: 0.45,
    offsetX: 0.01,
    offsetY: 0.215,
  },

  bottom: {
    sizeRatio: 0.50,
    offsetX: 0.01,
    offsetY: 0.47,
  },

  shoes: {
    sizeRatio: 0.41,
    offsetX: 0.01,
    offsetY: 0.75,
  },

  accessory: {
    sizeRatio: 0.35,
    offsetX: 0.01,
    offsetY: 0.09,
  },
};

const LEFT_PLACEMENTS: Record<AvatarLayerKey, AvatarLayerPlacement> = {
  body: {
    sizeRatio: 1,
    offsetX: 0,
    offsetY: 0,
  },

  hair: {
    sizeRatio: 0.42,
    offsetX: -0.01,
    offsetY: -0.09,
  },

  top: {
    sizeRatio: 0.45,
    offsetX: -0.01,
    offsetY: 0.215,
  },

  bottom: {
    sizeRatio: 0.50,
    offsetX: -0.01,
    offsetY: 0.47,
  },

  shoes: {
    sizeRatio: 0.41,
    offsetX: -0.01,
    offsetY: 0.75,
  },

  accessory: {
    sizeRatio: 0.35,
    offsetX: -0.01,
    offsetY: 0.09,
  },
};

const BACK_PLACEMENTS: Record<AvatarLayerKey, AvatarLayerPlacement> = {
  body: {
    sizeRatio: 1,
    offsetX: 0,
    offsetY: 0,
  },

  hair: {
    sizeRatio: 0.47,
    offsetX: 0,
    offsetY: -0.105,
  },

  top: {
    sizeRatio: 0.48,
    offsetX: 0,
    offsetY: 0.205,
  },

  bottom: {
    sizeRatio: 0.52,
    offsetX: 0,
    offsetY: 0.46,
  },

  shoes: {
    sizeRatio: 0.43,
    offsetX: 0,
    offsetY: 0.74,
  },

  accessory: {
    sizeRatio: 0.40,
    offsetX: 0,
    offsetY: 0.10,
  },
};

function getBasePlacements(
  direction: AvatarDirection,
): Record<AvatarLayerKey, AvatarLayerPlacement> {
  switch (direction) {
    case 'right':
      return RIGHT_PLACEMENTS;
    case 'left':
      return LEFT_PLACEMENTS;
    case 'back':
      return BACK_PLACEMENTS;
    case 'front':
    default:
      return FRONT_PLACEMENTS;
  }
}

function getAccessoryPlacement(
  accessoryStyle: AvatarAccessoryStyle,
  direction: AvatarDirection,
): AvatarLayerPlacement {
  switch (accessoryStyle) {
    case 'cap':
      if (direction === 'back') {
        return {
          sizeRatio: 0.34,
          offsetX: 0,
          offsetY: -0.03,
        };
      }

      return {
        sizeRatio: 0.33,
        offsetX: 0,
        offsetY: -0.06,
      };

    case 'bandana':
      return {
        sizeRatio: 0.30,
        offsetX: 0,
        offsetY: 0.01,
      };

    case 'glasses':
      return {
        sizeRatio: 0.24,
        offsetX: 0,
        offsetY: 0.08,
      };

    case 'backpack':
      if (direction === 'back') {
        return {
          sizeRatio: 0.46,
          offsetX: 0,
          offsetY: 0.16,
        };
      }

      if (direction === 'right') {
        return {
          sizeRatio: 0.40,
          offsetX: -0.04,
          offsetY: 0.19,
        };
      }

      if (direction === 'left') {
        return {
          sizeRatio: 0.40,
          offsetX: 0.04,
          offsetY: 0.19,
        };
      }

      return {
        sizeRatio: 0.42,
        offsetX: 0,
        offsetY: 0.20,
      };

    case 'watch':
      if (direction === 'front') {
        return {
          sizeRatio: 0.14,
          offsetX: 0.18,
          offsetY: 0.47,
        };
      }

      if (direction === 'right') {
        return {
          sizeRatio: 0.14,
          offsetX: 0.11,
          offsetY: 0.46,
        };
      }

      if (direction === 'left') {
        return {
          sizeRatio: 0.14,
          offsetX: -0.11,
          offsetY: 0.46,
        };
      }

      return {
        sizeRatio: 0.14,
        offsetX: 0,
        offsetY: 0.46,
      };

    case 'none':
    default:
      return {
        sizeRatio: 0.36,
        offsetX: 0,
        offsetY: 0.08,
      };
  }
}

export function getAvatarLayerOrder(
  config: AvatarConfig,
  direction: AvatarDirection,
): AvatarLayerKey[] {
  const baseOrder: AvatarLayerKey[] = ['body', 'bottom', 'shoes'];

  if (config.accessoryStyle === 'none') {
    return [...baseOrder, 'top', 'hair'];
  }

  if (config.accessoryStyle === 'backpack') {
    if (direction === 'back') {
      return [...baseOrder, 'top', 'hair', 'accessory'];
    }

    return [...baseOrder, 'accessory', 'top', 'hair'];
  }

  if (config.accessoryStyle === 'watch') {
    return [...baseOrder, 'top', 'hair', 'accessory'];
  }

  return [...baseOrder, 'top', 'hair', 'accessory'];
}

export function getAvatarLayerPlacements(
  config: AvatarConfig,
  direction: AvatarDirection,
): Record<AvatarLayerKey, AvatarLayerPlacement> {
  const base = getBasePlacements(direction);

  return {
    ...base,
    accessory: getAccessoryPlacement(config.accessoryStyle, direction),
  };
}