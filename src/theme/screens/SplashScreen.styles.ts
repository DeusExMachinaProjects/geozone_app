import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#050505',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: 110,
    height: 110,
    marginBottom: 14,
  },

  brandTitle: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 1,
  },

  brandTitleGeo: {
    color: '#ffffff',
  },

  brandTitleZone: {
    color: '#ff5b0a',
  },

  subtitle: {
    marginTop: 10,
    color: 'rgba(255,255,255,0.72)',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    textAlign: 'center',
  },

  loaderWrapper: {
    marginTop: 24,
  },
});