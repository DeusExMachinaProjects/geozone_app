import {StyleSheet} from 'react-native';
import {spacing} from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#050505',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: 24,
  },

  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  logoImage: {
    width: 110,
    height: 110,
  },

  title: {
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 4,
    lineHeight: 46,
  },

  titleGeo: {
    color: '#FFFFFF',
  },

  titleZone: {
    color: '#FF6B52',
  },

  subtitle: {
    fontSize: 16,
    color: '#E8A020',
    textAlign: 'center',
    letterSpacing: 0.8,
  },
});