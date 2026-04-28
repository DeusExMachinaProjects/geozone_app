import type {
  AvatarAccessoryStyle,
  AvatarBodyType,
  AvatarBottomStyle,
  AvatarCatalogItem,
  AvatarHairStyle,
  AvatarShoesStyle,
  AvatarTopStyle,
} from '../types';

export const bodyOptions: AvatarCatalogItem<AvatarBodyType>[] = [
  {
    id: 'masculine',
    label: 'Masculino',
  },
  {
    id: 'feminine',
    label: 'Femenino',
  },
];

export const hairOptions: AvatarCatalogItem<AvatarHairStyle>[] = [
  {
    id: 'spiky',
    label: 'Puntas',
  },
  {
    id: 'messy',
    label: 'Rebelde',
  },
  {
    id: 'bob',
    label: 'Bob',
  },
  {
    id: 'ponytail',
    label: 'Cola',
  },
  {
    id: 'twin_bun',
    label: 'Moños',
  },
  {
    id: 'braid',
    label: 'Trenza',
  },
  {
    id: 'mohawk',
    label: 'Mohawk',
  },
];

export const topOptions: AvatarCatalogItem<AvatarTopStyle>[] = [
  {
    id: 'shirt',
    label: 'Polera',
  },
  {
    id: 'hoodie',
    label: 'Hoodie',
  },
  {
    id: 'jacket',
    label: 'Chaqueta',
  },
  {
    id: 'jersey',
    label: 'Jersey',
  },
];

export const bottomOptions: AvatarCatalogItem<AvatarBottomStyle>[] = [
  {
    id: 'pants',
    label: 'Pantalón',
  },
  {
    id: 'shorts',
    label: 'Short',
  },
  {
    id: 'cargo',
    label: 'Cargo',
  },
];

export const shoesOptions: AvatarCatalogItem<AvatarShoesStyle>[] = [
  {
    id: 'sneakers',
    label: 'Zapatillas',
  },
  {
    id: 'boots',
    label: 'Botas',
  },
  {
    id: 'running',
    label: 'Running',
  },
];

export const accessoryOptions: AvatarCatalogItem<AvatarAccessoryStyle>[] = [
  {
    id: 'none',
    label: 'Sin accesorio',
  },
  {
    id: 'cap',
    label: 'Gorra',
  },
  {
    id: 'glasses',
    label: 'Lentes',
  },
  {
    id: 'backpack',
    label: 'Mochila',
  },
  {
    id: 'watch',
    label: 'Reloj',
  },
  {
    id: 'bandana',
    label: 'Bandana',
  },
];