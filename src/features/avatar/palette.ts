import {AvatarColorKey} from './types';

export const AVATAR_COLOR_PALETTE: Record<AvatarColorKey, string> = {
  black: '#111111',
  white: '#F5F5F5',
  gray: '#8A8A8A',
  red: '#E74C3C',
  blue: '#2F80ED',
  cyan: '#56CCF2',
  green: '#27AE60',
  yellow: '#F2C94C',
  orange: '#F2994A',
  purple: '#9B51E0',
  pink: '#EB5757',
};

export const AVATAR_COLOR_LABELS: Record<AvatarColorKey, string> = {
  black: 'Negro',
  white: 'Blanco',
  gray: 'Gris',
  red: 'Rojo',
  blue: 'Azul',
  cyan: 'Celeste',
  green: 'Verde',
  yellow: 'Amarillo',
  orange: 'Naranja',
  purple: 'Morado',
  pink: 'Rosado',
};

export function resolveAvatarColor(colorKey: AvatarColorKey): string {
  return AVATAR_COLOR_PALETTE[colorKey];
}