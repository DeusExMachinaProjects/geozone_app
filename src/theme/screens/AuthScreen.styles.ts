import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');

export const palette = {
  bg: '#050505',
  gold: '#E8A020',
  white: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.62)',
  textSoft: 'rgba(255,255,255,0.35)',
  border: 'rgba(255,255,255,0.14)',
  borderStrong: 'rgba(255,255,255,0.20)',
  surface: 'rgba(255,255,255,0.07)',
  inputBg: '#111111',
};

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  screen: {
    flex: 1,
    backgroundColor: palette.bg,
    overflow: 'hidden',
  },

  bottomGlow: {
    position: 'absolute',
    bottom: -180,
    left: -40,
    right: -40,
    height: 340,
    backgroundColor: palette.gold,
    opacity: 0.08,
    borderRadius: 999,
  },

  welcomeWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 42,
    paddingBottom: 28,
    justifyContent: 'space-between',
  },

  topBlock: {
    alignItems: 'center',
    marginTop: 8,
  },

  middleBlock: {
    gap: 14,
    marginTop: 12,
  },

  bottomBlock: {
    alignItems: 'center',
    marginBottom: 6,
  },

  loginWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 42,
    paddingBottom: 28,
    justifyContent: 'center',
  },

  loginHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },

  logoImage: {
    width: width * 0.22,
    height: width * 0.22,
    maxWidth: 90,
    maxHeight: 90,
    marginBottom: 22,
  },

  logoImageSmall: {
    width: 72,
    height: 72,
    marginBottom: 20,
  },

  brandTitle: {
    color: palette.white,
    fontSize: 58,
    fontWeight: '900',
    letterSpacing: 8,
    lineHeight: 64,
    marginBottom: 14,
  },

  brandSubtitle: {
    color: palette.gold,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 1.8,
    textAlign: 'center',
  },

  loginTitle: {
    color: palette.white,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 8,
  },

  loginSubtitle: {
    color: palette.textMuted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 12,
  },

  formCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 24,
    padding: 18,
  },

  fieldBlock: {
    marginBottom: 14,
  },

  label: {
    color: palette.white,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },

  input: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.borderStrong,
    backgroundColor: palette.inputBg,
    paddingHorizontal: 16,
    color: palette.white,
    fontSize: 15,
  },

  primaryButton: {
    height: 60,
    borderRadius: 18,
    backgroundColor: palette.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginPrimaryButton: {
    marginTop: 4,
  },

  primaryButtonText: {
    color: '#0A0A0A',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },

  secondaryButton: {
    height: 60,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.borderStrong,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginSecondaryButton: {
    marginTop: 12,
  },

  secondaryButtonText: {
    color: palette.white,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },

  dividerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },

  dividerText: {
    color: palette.textSoft,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    marginHorizontal: 12,
  },

  socialRow: {
    flexDirection: 'row',
    gap: 18,
  },

  socialButton: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  socialButtonText: {
    color: palette.white,
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 34,
  },

  buttonPressed: {
    opacity: 0.9,
    transform: [{scale: 0.98}],
  },
  brandTitle: {
    fontSize: 58,
    fontWeight: '900',
    letterSpacing: 8,
    lineHeight: 64,
    marginBottom: 14,
  },

  brandTitleGeo: {
    color: palette.white,
  },

  brandTitleZone: {
    color: '#FF6B52',
  },
  socialIconImage: {
    width: 28,
    height: 28,
  }
});