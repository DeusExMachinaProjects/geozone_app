import {StyleSheet} from 'react-native';
import {spacing} from '..';

export const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.72)',
  },

  backdropPressable: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  panel: {
    flex: 1,
    backgroundColor: '#050505',
    marginTop: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#1D1D1D',
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },

  headerTextBlock: {
    flex: 1,
    paddingRight: spacing.md,
  },

  eyebrow: {
    color: '#FF6A39',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 6,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 6,
  },

  subtitle: {
    color: '#BDBDBD',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },

  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#131313',
    borderWidth: 1,
    borderColor: '#242424',
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },

  highlightCard: {
    backgroundColor: '#111111',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1D1D1D',
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },

  highlightTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 6,
  },

  highlightText: {
    color: '#BEBEBE',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },

  listContent: {
    paddingBottom: 42,
  },

  card: {
    backgroundColor: '#111111',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1D1D1D',
    padding: spacing.lg,
    marginBottom: spacing.md,
  },

  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  badge: {
    backgroundColor: '#171717',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  cardTime: {
    fontSize: 12,
    fontWeight: '800',
  },

  cardTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 8,
  },

  cardDescription: {
    color: '#BEBEBE',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    marginBottom: spacing.md,
  },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardFooterText: {
    color: 'rgba(255,255,255,0.46)',
    fontSize: 12,
    fontWeight: '700',
  },

  cardFooterArrow: {
    fontSize: 20,
    fontWeight: '900',
  },
});