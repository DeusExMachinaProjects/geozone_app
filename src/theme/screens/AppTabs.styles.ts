import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  outerWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  tabBarContainer: {
    width: '86%',
    maxWidth: 360,
    minHeight: 72,
    borderRadius: 24,
    backgroundColor: 'rgba(28, 32, 32, 0.96)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 18,
  },

  tabButton: {
    flex: 1,
    minHeight: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    paddingVertical: 6,
  },

  activeTabButton: {
    backgroundColor: '#FF6A39',

    shadowColor: '#FF6A39',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 8,
  },

  tabIcon: {
    color: 'rgba(255,255,255,0.34)',
    marginBottom: 2,
  },

  activeTabIcon: {
    color: '#FFFFFF',
  },

  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.34)',
  },

  activeTabLabel: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});