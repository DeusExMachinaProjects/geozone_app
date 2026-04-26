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
  brandZone: '#FF6B52',
  card: 'rgba(255,255,255,0.03)',
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

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 28,
  },

  scrollContentNoScroll: {
    justifyContent: 'center',
  },

  topBlock: {
    alignItems: 'center',
    marginBottom: 22,
  },

  logoImage: {
    width: width * 0.20,
    height: width * 0.20,
    maxWidth: 82,
    maxHeight: 82,
    marginBottom: 18,
  },

  brandTitle: {
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: 4,
    lineHeight: 58,
    marginBottom: 10,
  },

  brandTitleGeo: {
    color: palette.white,
  },

  brandTitleZone: {
    color: palette.brandZone,
  },

  registerSubtitle: {
    color: palette.white,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },

  formCard: {
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 24,
    padding: 18,
  },

  progressRow: {
    marginBottom: 18,
  },

  progressPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(255,107,82,0.16)',
  },

  progressPillText: {
    color: palette.brandZone,
    fontSize: 12,
    fontWeight: '800',
  },

  stepTitle: {
    color: palette.white,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10,
  },

  stepSubtitle: {
    color: palette.textMuted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    paddingHorizontal: 6,
  },

  fieldBlock: {
    marginBottom: 16,
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

  helper: {
    marginTop: 6,
    color: palette.textSoft,
    fontSize: 12,
    lineHeight: 16,
  },

  helperCentered: {
    marginTop: 8,
    color: palette.textMuted,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },

  optionButton: {
    minHeight: 58,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.borderStrong,
    backgroundColor: palette.inputBg,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  optionButtonActive: {
    borderColor: palette.brandZone,
    backgroundColor: 'rgba(255,107,82,0.08)',
  },

  optionButtonText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: '700',
  },

  optionButtonTextActive: {
    color: palette.brandZone,
  },

  summaryCard: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    marginBottom: 8,
  },

  summaryTitle: {
    color: palette.white,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },

  summaryText: {
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },

  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 22,
  },

  primaryButton: {
    flex: 1.1,
    height: 60,
    borderRadius: 18,
    backgroundColor: palette.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: '#0A0A0A',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.6,
  },

  secondaryButton: {
    flex: 1,
    height: 60,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.borderStrong,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: palette.white,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.6,
  },

  buttonPressed: {
    opacity: 0.9,
    transform: [{scale: 0.98}],
  },

  buttonDisabled: {
    opacity: 0.65,
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: 16,
    paddingLeft: 16,
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    paddingVertical: 15,
  },

  passwordToggle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },
});