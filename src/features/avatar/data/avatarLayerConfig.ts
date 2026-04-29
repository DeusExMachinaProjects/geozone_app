import type {
  AvatarAccessoryType,
  AvatarConfig,
  AvatarDirection,
} from './avatarSpriteManifest';

export const BASE_SPRITE_CANVAS = 128;

export type AvatarLayerKey =
  | 'body'
  | 'bottom'
  | 'footwear'
  | 'top'
  | 'hair'
  | 'accessory';

export type AvatarLayerTransform = {
  x: number;
  y: number;
  scale: number;
};

const COMMON_SCALE = 0.78;

/**
 * Estos valores son el punto de partida para acomodar
 * las capas generadas por IA dentro del mismo escenario.
 *
 * Si luego quieres afinar, este es el archivo donde debes tocar.
 */
const baseTransforms: Record<AvatarLayerKey, AvatarLayerTransform> = {
  body: {
    x: 0,
    y: 6,
    scale: COMMON_SCALE,
  },
  hair: {
    x: 0,
    y: -28,
    scale: COMMON_SCALE,
  },
  top: {
    x: 0,
    y: 6,
    scale: COMMON_SCALE,
  },
  bottom: {
    x: 0,
    y: 24,
    scale: COMMON_SCALE,
  },
  footwear: {
    x: 0,
    y: 42,
    scale: COMMON_SCALE,
  },
  accessory: {
    x: 0,
    y: 0,
    scale: COMMON_SCALE,
  },
};

function getAccessoryTransform(
  accessoryType: AvatarAccessoryType,
  direction: AvatarDirection,
): AvatarLayerTransform {
  switch (accessoryType) {
    case 'cap':
      return {
        x: 0,
        y: -31,
        scale: COMMON_SCALE,
      };

    case 'bandana':
      return {
        x: 0,
        y: -24,
        scale: COMMON_SCALE,
      };

    case 'glasses':
      return {
        x: 0,
        y: -10,
        scale: COMMON_SCALE,
      };

    case 'backpack':
      if (direction === 'back') {
        return {
          x: 0,
          y: 6,
          scale: COMMON_SCALE,
        };
      }

      if (direction === 'right') {
        return {
          x: -2,
          y: 8,
          scale: COMMON_SCALE,
        };
      }

      if (direction === 'left') {
        return {
          x: 2,
          y: 8,
          scale: COMMON_SCALE,
        };
      }

      return {
        x: 0,
        y: 10,
        scale: COMMON_SCALE,
      };

    case 'watch':
      if (direction === 'front') {
        return {
          x: 18,
          y: 16,
          scale: COMMON_SCALE,
        };
      }

      if (direction === 'right') {
        return {
          x: 10,
          y: 14,
          scale: COMMON_SCALE,
        };
      }

      if (direction === 'left') {
        return {
          x: -10,
          y: 14,
          scale: COMMON_SCALE,
        };
      }

      return {
        x: 0,
        y: 14,
        scale: COMMON_SCALE,
      };

    case 'none':
    default:
      return {
        x: 0,
        y: 0,
        scale: COMMON_SCALE,
      };
  }
}

export function getAvatarLayerOrder(
  config: AvatarConfig,
  direction: AvatarDirection,
): AvatarLayerKey[] {
  const baseOrder: AvatarLayerKey[] = ['body', 'bottom', 'footwear'];

  if (config.accessoryType === 'none') {
    return [...baseOrder, 'top', 'hair'];
  }

  // Mochila: en frontal/lateral conviene dibujarla antes del top
  // para que las tiras queden "dentro" del cuerpo.
  if (config.accessoryType === 'backpack') {
    if (direction === 'back') {
      return [...baseOrder, 'top', 'hair', 'accessory'];
    }

    return [...baseOrder, 'accessory', 'top', 'hair'];
  }

  // Reloj: va sobre la ropa
  if (config.accessoryType === 'watch') {
    return [...baseOrder, 'top', 'hair', 'accessory'];
  }

  // Lentes, gorra, bandana normalmente van al final
  return [...baseOrder, 'top', 'hair', 'accessory'];
}

export function getAvatarLayerTransforms(
  config: AvatarConfig,
  direction: AvatarDirection,
): Record<AvatarLayerKey, AvatarLayerTransform> {
  return {
    body: baseTransforms.body,
    bottom: baseTransforms.bottom,
    footwear: baseTransforms.footwear,
    top: baseTransforms.top,
    hair: baseTransforms.hair,
    accessory: getAccessoryTransform(config.accessoryType, direction),
  };
}