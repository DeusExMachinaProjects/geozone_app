import {StyleSheet} from 'react-native';
import {spacing} from '..';

export const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    backgroundColor: '#050505',
    paddingTop: spacing.md,
    paddingBottom: 120,
  },

  headerBlock: {
    marginBottom: spacing.lg,
  },

  eyebrow: {
    color: '#FF6A39',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#B9B9B9',
  },

  summaryCard: {
    backgroundColor: '#111111',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1D1D1D',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },

  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },

  summaryValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },

  summaryLabel: {
    color: '#9E9E9E',
    fontSize: 12,
    fontWeight: '700',
  },

  summaryDivider: {
    width: 1,
    height: 34,
    backgroundColor: '#232323',
    marginHorizontal: 8,
  },

  list: {
    paddingBottom: spacing.md,
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

  statusBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: '#171717',
  },

  statusBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  reward: {
    fontSize: 14,
    fontWeight: '900',
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },

  cardDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: '#BEBEBE',
    marginBottom: spacing.md,
  },

  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardHint: {
    color: 'rgba(255,255,255,0.42)',
    fontSize: 12,
    fontWeight: '700',
  },

  cardArrow: {
    color: '#FF6A39',
    fontSize: 20,
    fontWeight: '900',
  },
});