import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MainTabParamList} from './types';
import {HomeScreen} from '../screens/HomeScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import {MissionsScreen} from '../screens/MissionsScreen';
import {styles} from '../theme/screens/AppTabs.styles';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_CONFIG = {
  Home: {
    label: 'Conquista',
    iconOutline: 'location-outline',
    iconFilled: 'location',
  },
  Profile: {
    label: 'Perfil',
    iconOutline: 'person-outline',
    iconFilled: 'person',
  },
  Missions: {
    label: 'Misiones',
    iconOutline: 'trophy-outline',
    iconFilled: 'trophy',
  },
} as const;

function CustomTabBar({state, descriptors, navigation}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.outerWrapper,
        {
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}>
      <View style={styles.tabBarContainer}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const routeName = route.name as keyof typeof TAB_CONFIG;
          const config = TAB_CONFIG[routeName];

          if (!config) {
            return null;
          }

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name as never);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={
                descriptors[route.key].options.tabBarAccessibilityLabel
              }
              testID={descriptors[route.key].options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[styles.tabButton, isFocused && styles.activeTabButton]}>
              <Ionicons
                name={isFocused ? config.iconFilled : config.iconOutline}
                size={20}
                style={[styles.tabIcon, isFocused && styles.activeTabIcon]}
              />

              <Text style={[styles.tabLabel, isFocused && styles.activeTabLabel]}>
                {config.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function AppTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Missions" component={MissionsScreen} />
    </Tab.Navigator>
  );
}