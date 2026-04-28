import type {
  AvatarAccessoryStyle,
  AvatarBodyType,
  AvatarBottomStyle,
  AvatarDirection,
  AvatarHairStyle,
  AvatarLayerImages,
  AvatarShoesStyle,
  AvatarTopStyle,
} from '../types';

export const AVATAR_DIRECTIONS: AvatarDirection[] = [
  'front',
  'right',
  'back',
  'left',
];

export const avatarBodyAssets: Record<AvatarBodyType, AvatarLayerImages> = {
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

export const avatarHairAssets: Record<AvatarHairStyle, AvatarLayerImages> = {
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

export const avatarTopAssets: Record<AvatarTopStyle, AvatarLayerImages> = {
  shirt: {
    front: require('../../../assets/avatar/top/shirt/front.png'),
    right: require('../../../assets/avatar/top/shirt/right.png'),
    back: require('../../../assets/avatar/top/shirt/back.png'),
    left: require('../../../assets/avatar/top/shirt/left.png'),
  },
  hoodie: {
    front: require('../../../assets/avatar/top/hoodie/front.png'),
    right: require('../../../assets/avatar/top/hoodie/right.png'),
    back: require('../../../assets/avatar/top/hoodie/back.png'),
    left: require('../../../assets/avatar/top/hoodie/left.png'),
  },
  jacket: {
    front: require('../../../assets/avatar/top/jacket/front.png'),
    right: require('../../../assets/avatar/top/jacket/right.png'),
    back: require('../../../assets/avatar/top/jacket/back.png'),
    left: require('../../../assets/avatar/top/jacket/left.png'),
  },
  jersey: {
    front: require('../../../assets/avatar/top/jersey/front.png'),
    right: require('../../../assets/avatar/top/jersey/right.png'),
    back: require('../../../assets/avatar/top/jersey/back.png'),
    left: require('../../../assets/avatar/top/jersey/left.png'),
  },
};

export const avatarBottomAssets: Record<AvatarBottomStyle, AvatarLayerImages> = {
  pants: {
    front: require('../../../assets/avatar/bottom/pants/front.png'),
    right: require('../../../assets/avatar/bottom/pants/right.png'),
    back: require('../../../assets/avatar/bottom/pants/back.png'),
    left: require('../../../assets/avatar/bottom/pants/left.png'),
  },
  shorts: {
    front: require('../../../assets/avatar/bottom/shorts/front.png'),
    right: require('../../../assets/avatar/bottom/shorts/right.png'),
    back: require('../../../assets/avatar/bottom/shorts/back.png'),
    left: require('../../../assets/avatar/bottom/shorts/left.png'),
  },
  cargo: {
    front: require('../../../assets/avatar/bottom/cargo/front.png'),
    right: require('../../../assets/avatar/bottom/cargo/right.png'),
    back: require('../../../assets/avatar/bottom/cargo/back.png'),
    left: require('../../../assets/avatar/bottom/cargo/left.png'),
  },
};

export const avatarShoesAssets: Record<AvatarShoesStyle, AvatarLayerImages> = {
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

export const avatarAccessoryAssets: Partial<
  Record<AvatarAccessoryStyle, AvatarLayerImages>
> = {
  cap: {
    front: require('../../../assets/avatar/accessory/cap/front.png'),
    right: require('../../../assets/avatar/accessory/cap/right.png'),
    back: require('../../../assets/avatar/accessory/cap/back.png'),
    left: require('../../../assets/avatar/accessory/cap/left.png'),
  },
  glasses: {
    front: require('../../../assets/avatar/accessory/glasses/front.png'),
    right: require('../../../assets/avatar/accessory/glasses/right.png'),
    back: require('../../../assets/avatar/accessory/glasses/back.png'),
    left: require('../../../assets/avatar/accessory/glasses/left.png'),
  },
  backpack: {
    front: require('../../../assets/avatar/accessory/backpack/front.png'),
    right: require('../../../assets/avatar/accessory/backpack/right.png'),
    back: require('../../../assets/avatar/accessory/backpack/back.png'),
    left: require('../../../assets/avatar/accessory/backpack/left.png'),
  },
  watch: {
    front: require('../../../assets/avatar/accessory/watch/front.png'),
    right: require('../../../assets/avatar/accessory/watch/right.png'),
    back: require('../../../assets/avatar/accessory/watch/back.png'),
    left: require('../../../assets/avatar/accessory/watch/left.png'),
  },
  bandana: {
    front: require('../../../assets/avatar/accessory/bandana/front.png'),
    right: require('../../../assets/avatar/accessory/bandana/right.png'),
    back: require('../../../assets/avatar/accessory/bandana/back.png'),
    left: require('../../../assets/avatar/accessory/bandana/left.png'),
  },
};