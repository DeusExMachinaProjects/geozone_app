import type {ImageSourcePropType} from 'react-native';

export type AvatarDirection = 'front' | 'right' | 'back' | 'left';

export type AvatarBodyType = 'masculine' | 'feminine';

export type AvatarHairType =
  | 'none'
  | 'spiky'
  | 'messy'
  | 'bob'
  | 'ponytail'
  | 'twin_bun'
  | 'braid'
  | 'mohawk';

export type AvatarTopType =
  | 'none'
  | 'shirt'
  | 'hoodie'
  | 'jacket'
  | 'jersey';

export type AvatarBottomType =
  | 'none'
  | 'pants'
  | 'shorts'
  | 'cargo';

export type AvatarShoesType =
  | 'none'
  | 'sneakers'
  | 'boots'
  | 'running';

export type AvatarAccessoryType =
  | 'none'
  | 'cap'
  | 'glasses'
  | 'backpack'
  | 'watch'
  | 'bandana';

export type DirectionalAssets = Record<AvatarDirection, ImageSourcePropType>;

export const avatarBodyAssets: Record<AvatarBodyType, DirectionalAssets> = {
  masculine: {
    front: require('../../../assets/avatar/body/masculine/front.png'),
    right: require('../../../assets/avatar/body/masculine/right.png'),
    back: require('../../../assets/avatar/body/masculine/back.png'),
    left: require('../../../assets/avatar/body/masculine/left.png'),
  },
  feminine: {
    front: require('../../../assets/avatar/body/feminine/front.png'),
    right: require('../../../assets/avatar/body/feminine/right.png'),
    back: require('../../../assets/avatar/body/feminine/back.png'),
    left: require('../../../assets/avatar/body/feminine/left.png'),
  },
};

export const avatarHairAssets: Record<
  Exclude<AvatarHairType, 'none'>,
  DirectionalAssets
> = {
  spiky: {
    front: require('../../../assets/avatar/hair/spiky/front.png'),
    right: require('../../../assets/avatar/hair/spiky/right.png'),
    back: require('../../../assets/avatar/hair/spiky/back.png'),
    left: require('../../../assets/avatar/hair/spiky/left.png'),
  },
  messy: {
    front: require('../../../assets/avatar/hair/messy/front.png'),
    right: require('../../../assets/avatar/hair/messy/right.png'),
    back: require('../../../assets/avatar/hair/messy/back.png'),
    left: require('../../../assets/avatar/hair/messy/left.png'),
  },
  bob: {
    front: require('../../../assets/avatar/hair/bob/front.png'),
    right: require('../../../assets/avatar/hair/bob/right.png'),
    back: require('../../../assets/avatar/hair/bob/back.png'),
    left: require('../../../assets/avatar/hair/bob/left.png'),
  },
  ponytail: {
    front: require('../../../assets/avatar/hair/ponytail/front.png'),
    right: require('../../../assets/avatar/hair/ponytail/right.png'),
    back: require('../../../assets/avatar/hair/ponytail/back.png'),
    left: require('../../../assets/avatar/hair/ponytail/left.png'),
  },
  twin_bun: {
    front: require('../../../assets/avatar/hair/twin_bun/front.png'),
    right: require('../../../assets/avatar/hair/twin_bun/right.png'),
    back: require('../../../assets/avatar/hair/twin_bun/back.png'),
    left: require('../../../assets/avatar/hair/twin_bun/left.png'),
  },
  braid: {
    front: require('../../../assets/avatar/hair/braid/front.png'),
    right: require('../../../assets/avatar/hair/braid/right.png'),
    back: require('../../../assets/avatar/hair/braid/back.png'),
    left: require('../../../assets/avatar/hair/braid/left.png'),
  },
  mohawk: {
    front: require('../../../assets/avatar/hair/mohawk/front.png'),
    right: require('../../../assets/avatar/hair/mohawk/right.png'),
    back: require('../../../assets/avatar/hair/mohawk/back.png'),
    left: require('../../../assets/avatar/hair/mohawk/left.png'),
  },
};

export const avatarTopAssets: Record<
  Exclude<AvatarTopType, 'none'>,
  DirectionalAssets
> = {
  shirt: {
    front: require('../../../assets/avatar/tops/shirt/front.png'),
    right: require('../../../assets/avatar/tops/shirt/right.png'),
    back: require('../../../assets/avatar/tops/shirt/back.png'),
    left: require('../../../assets/avatar/tops/shirt/left.png'),
  },
  hoodie: {
    front: require('../../../assets/avatar/tops/hoodie/front.png'),
    right: require('../../../assets/avatar/tops/hoodie/right.png'),
    back: require('../../../assets/avatar/tops/hoodie/back.png'),
    left: require('../../../assets/avatar/tops/hoodie/left.png'),
  },
  jacket: {
    front: require('../../../assets/avatar/tops/jacket/front.png'),
    right: require('../../../assets/avatar/tops/jacket/right.png'),
    back: require('../../../assets/avatar/tops/jacket/back.png'),
    left: require('../../../assets/avatar/tops/jacket/left.png'),
  },
  jersey: {
    front: require('../../../assets/avatar/tops/jersey/front.png'),
    right: require('../../../assets/avatar/tops/jersey/right.png'),
    back: require('../../../assets/avatar/tops/jersey/back.png'),
    left: require('../../../assets/avatar/tops/jersey/left.png'),
  },
};

export const avatarBottomAssets: Record<
  Exclude<AvatarBottomType, 'none'>,
  DirectionalAssets
> = {
  pants: {
    front: require('../../../assets/avatar/bottoms/pants/front.png'),
    right: require('../../../assets/avatar/bottoms/pants/right.png'),
    back: require('../../../assets/avatar/bottoms/pants/back.png'),
    left: require('../../../assets/avatar/bottoms/pants/left.png'),
  },
  shorts: {
    front: require('../../../assets/avatar/bottoms/shorts/front.png'),
    right: require('../../../assets/avatar/bottoms/shorts/right.png'),
    back: require('../../../assets/avatar/bottoms/shorts/back.png'),
    left: require('../../../assets/avatar/bottoms/shorts/left.png'),
  },
  cargo: {
    front: require('../../../assets/avatar/bottoms/cargo/front.png'),
    right: require('../../../assets/avatar/bottoms/cargo/right.png'),
    back: require('../../../assets/avatar/bottoms/cargo/back.png'),
    left: require('../../../assets/avatar/bottoms/cargo/left.png'),
  },
};

export const avatarShoesAssets: Record<
  Exclude<AvatarShoesType, 'none'>,
  DirectionalAssets
> = {
  sneakers: {
    front: require('../../../assets/avatar/shoes/sneakers/front.png'),
    right: require('../../../assets/avatar/shoes/sneakers/right.png'),
    back: require('../../../assets/avatar/shoes/sneakers/back.png'),
    left: require('../../../assets/avatar/shoes/sneakers/left.png'),
  },
  boots: {
    front: require('../../../assets/avatar/shoes/boots/front.png'),
    right: require('../../../assets/avatar/shoes/boots/right.png'),
    back: require('../../../assets/avatar/shoes/boots/back.png'),
    left: require('../../../assets/avatar/shoes/boots/left.png'),
  },
  running: {
    front: require('../../../assets/avatar/shoes/running/front.png'),
    right: require('../../../assets/avatar/shoes/running/right.png'),
    back: require('../../../assets/avatar/shoes/running/back.png'),
    left: require('../../../assets/avatar/shoes/running/left.png'),
  },
};

export const avatarAccessoryAssets: Record<
  Exclude<AvatarAccessoryType, 'none'>,
  DirectionalAssets
> = {
  cap: {
    front: require('../../../assets/avatar/accessories/cap/front.png'),
    right: require('../../../assets/avatar/accessories/cap/right.png'),
    back: require('../../../assets/avatar/accessories/cap/back.png'),
    left: require('../../../assets/avatar/accessories/cap/left.png'),
  },
  glasses: {
    front: require('../../../assets/avatar/accessories/glasses/front.png'),
    right: require('../../../assets/avatar/accessories/glasses/right.png'),
    back: require('../../../assets/avatar/accessories/glasses/back.png'),
    left: require('../../../assets/avatar/accessories/glasses/left.png'),
  },
  backpack: {
    front: require('../../../assets/avatar/accessories/backpack/front.png'),
    right: require('../../../assets/avatar/accessories/backpack/right.png'),
    back: require('../../../assets/avatar/accessories/backpack/back.png'),
    left: require('../../../assets/avatar/accessories/backpack/left.png'),
  },
  watch: {
    front: require('../../../assets/avatar/accessories/watch/front.png'),
    right: require('../../../assets/avatar/accessories/watch/right.png'),
    back: require('../../../assets/avatar/accessories/watch/back.png'),
    left: require('../../../assets/avatar/accessories/watch/left.png'),
  },
  bandana: {
    front: require('../../../assets/avatar/accessories/bandana/front.png'),
    right: require('../../../assets/avatar/accessories/bandana/right.png'),
    back: require('../../../assets/avatar/accessories/bandana/back.png'),
    left: require('../../../assets/avatar/accessories/bandana/left.png'),
  },
};