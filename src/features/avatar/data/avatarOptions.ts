import type {AvatarCategory, AvatarConfig, AvatarOption} from '../types';

export const AVATAR_STORAGE_KEY = '@geozone/avatar/v1';

export const DEFAULT_AVATAR: AvatarConfig = {
  bodyType: 'masculine',
  skinTone: '#D99267',
  hairStyle: 'spiky',
  hairColor: '#7A3F22',
  topStyle: 'hoodie',
  topColor: '#EF4E3F',
  bottomStyle: 'shorts',
  bottomColor: '#15171D',
  shoeStyle: 'runner',
  shoeColor: '#F2F5F7',
  accessory: 'backpack',
  accessoryColor: '#D29A2E',
};

export const CATEGORY_LABELS: Record<AvatarCategory, {label: string; icon: string}> = {
  hair: {label: 'Cabello', icon: '✦'},
  face: {label: 'Rostro', icon: '◉'},
  top: {label: 'Superior', icon: '▣'},
  bottom: {label: 'Inferior', icon: '▥'},
  shoes: {label: 'Calzado', icon: '▰'},
  accessories: {label: 'Accesorios', icon: '✧'},
};

export const AVATAR_OPTIONS: Record<AvatarCategory, AvatarOption[]> = {
  hair: [
    {id: 'spiky', label: 'Puntas'},
    {id: 'messy', label: 'Rebelde'},
    {id: 'bob', label: 'Bob'},
    {id: 'pony', label: 'Coleta'},
    {id: 'buns', label: 'Moños'},
    {id: 'mohawk', label: 'Cresta'},
    {id: 'braid', label: 'Trenza'},
  ],
  face: [
    {id: '#F1C09A', label: 'Claro'},
    {id: '#D99267', label: 'Medio'},
    {id: '#A8633F', label: 'Bronce'},
    {id: '#6D4635', label: 'Oscuro'},
  ],
  top: [
    {id: 'tee', label: 'Polera'},
    {id: 'sport', label: 'Sport'},
    {id: 'hoodie', label: 'Hoodie'},
    {id: 'jacket', label: 'Chaqueta'},
    {id: 'jersey', label: 'Jersey'},
  ],
  bottom: [
    {id: 'shorts', label: 'Shorts'},
    {id: 'joggers', label: 'Joggers'},
    {id: 'cargo', label: 'Cargo'},
    {id: 'leggings', label: 'Leggings'},
  ],
  shoes: [
    {id: 'runner', label: 'Runner'},
    {id: 'trainer', label: 'Trainer'},
    {id: 'hightop', label: 'High top'},
    {id: 'trail', label: 'Trail'},
  ],
  accessories: [
    {id: 'none', label: 'Nada'},
    {id: 'cap', label: 'Gorra'},
    {id: 'glasses', label: 'Lentes'},
    {id: 'backpack', label: 'Mochila'},
    {id: 'watch', label: 'Reloj'},
    {id: 'bandana', label: 'Bandana'},
  ],
};

export const COLOR_PALETTES: Record<AvatarCategory, string[]> = {
  hair: ['#7A3F22', '#1F232B', '#F4C74F', '#243250', '#CF2B2B', '#DF5D8D', '#7C3F98', '#239C93'],
  face: ['#F1C09A', '#D99267', '#A8633F', '#6D4635'],
  top: ['#EF4E3F', '#111318', '#274C8F', '#17A9A3', '#E9B638', '#8E50C4', '#F2F4F7'],
  bottom: ['#15171D', '#27364E', '#B49A62', '#2E5F4B', '#7B4E36', '#D85C8E'],
  shoes: ['#F2F5F7', '#121418', '#2D63B8', '#CF3434', '#1B948C', '#D99B39'],
  accessories: ['#EF4E3F', '#111318', '#274C8F', '#17A9A3', '#E9B638', '#8E50C4', '#F2F4F7'],
};
