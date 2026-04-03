import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#050505',
    overflow: 'hidden',
  },

  container: {
    flex: 1,
    backgroundColor: '#050505',
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },

  bottomGlow: {
    position: 'absolute',
    bottom: -190,
    left: -40,
    right: -40,
    height: 300,
    backgroundColor: '#E8A020',
    opacity: 0.07,
    borderRadius: 999,
  },

  hero: {
    alignItems: 'center',
    marginBottom: 18,
  },

  logoImage: {
    width: 68,
    height: 68,
    marginBottom: 14,
  },

  kicker: {
    fontSize: 11,
    fontWeight: '800',
    color: '#E8A020',
    marginBottom: 8,
    letterSpacing: 1.4,
  },

  title: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 2.5,
    lineHeight: 36,
    marginBottom: 8,
  },

  titleGeo: {
    color: '#FFFFFF',
  },

  titleZone: {
    color: '#FF6B52',
  },

  headline: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: 'rgba(255,255,255,0.68)',
    textAlign: 'center',
    paddingHorizontal: 4,
  },

  cardsWrapper: {
    gap: 10,
    marginBottom: 18,
  },

  featureCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },

  cardText: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.62)',
  },

  actions: {
    paddingTop: 10,
  },

  primaryButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: '#E8A020',
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  buttonPressed: {
    opacity: 0.9,
    transform: [{scale: 0.98}],
  },
});