import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, Easing, View} from 'react-native';
import {AvatarSprite} from './AvatarSprite';
import type {AvatarConfig, AvatarFacing} from '../types';

type AnimatedAvatarSpriteProps = {
  config: AvatarConfig;
  heading?: number | null;
  isMoving?: boolean;
  size?: number;
};

export function AnimatedAvatarSprite({config, heading, isMoving = true, size = 68}: AnimatedAvatarSpriteProps) {
  const step = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isMoving) {
      step.stopAnimation();
      step.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(step, {
          toValue: 1,
          duration: 220,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(step, {
          toValue: 0,
          duration: 220,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();

    return () => loop.stop();
  }, [isMoving, step]);

  const facing = useMemo(() => headingToFacing(heading), [heading]);
  const translateY = step.interpolate({inputRange: [0, 1], outputRange: [0, -3]});
  const rotate = step.interpolate({inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg']});

  return (
    <View pointerEvents="none">
      <Animated.View style={{transform: [{translateY}, {rotate}]}}>
        <AvatarSprite config={config} facing={facing} size={size} />
      </Animated.View>
    </View>
  );
}

function headingToFacing(heading?: number | null): AvatarFacing {
  if (heading === null || heading === undefined || Number.isNaN(heading)) {
    return 'front';
  }

  const normalized = ((heading % 360) + 360) % 360;

  if (normalized >= 45 && normalized < 135) {
    return 'right';
  }

  if (normalized >= 135 && normalized < 225) {
    return 'back';
  }

  if (normalized >= 225 && normalized < 315) {
    return 'left';
  }

  return 'front';
}
