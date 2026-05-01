import {StyleSheet} from 'react-native';
import {spacing} from '..';

export const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    backgroundColor: '#050505',
    paddingTop: spacing.md,
    paddingBottom: 120,
  },

  headerCard: {
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 26,
    paddingVertical: 28,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: '#1D1D1D',
    marginBottom: spacing.lg,
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6A39',
    marginBottom: spacing.md,
  },

  avatarText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  levelBadge: {
    backgroundColor: '#1B1B1B',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: spacing.sm,
  },

  levelBadgeText: {
    color: '#FF6A39',
    fontSize: 12,
    fontWeight: '900',
  },

  name: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },

  username: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 4,
    textAlign: 'center',
  },

  tag: {
    fontSize: 14,
    fontWeight: '700',
    color: '#C9C9C9',
    textAlign: 'center',
    marginBottom: spacing.md,
  },

  pillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoPill: {
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#282828',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
  },

  infoPillText: {
    color: '#E6E6E6',
    fontSize: 11,
    fontWeight: '700',
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },

  statCard: {
    width: '31.5%',
    backgroundColor: '#121212',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#1D1D1D',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },

  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FF6A39',
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B9B9B9',
    textAlign: 'center',
  },

  mainCard: {
    backgroundColor: '#111111',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1D1D1D',
    padding: spacing.lg,
    marginBottom: spacing.md,
  },

  infoCard: {
    backgroundColor: '#111111',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1D1D1D',
    padding: spacing.lg,
    marginBottom: spacing.md,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },

  cardText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#BEBEBE',
    marginBottom: spacing.md,
  },

  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  progressLabel: {
    color: '#D0D0D0',
    fontSize: 12,
    fontWeight: '700',
  },

  progressPercent: {
    color: '#FF6A39',
    fontSize: 12,
    fontWeight: '900',
  },

  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#252525',
    overflow: 'hidden',
  },

  progressFill: {
    width: '72%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#FF6A39',
  },

  friendsActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  friendActionBox: {
    width: '48%',
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#282828',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
  },

  friendActionValue: {
    color: '#FF6A39',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 4,
    textAlign: 'center',
  },

  friendActionLabel: {
    color: '#C9C9C9',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  dashboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,107,82,0.32)',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  dashboardButtonPressed: {
    opacity: 0.9,
    transform: [{scale: 0.99}],
  },

  dashboardButtonIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#FF6B52',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  dashboardButtonTextBlock: {
    flex: 1,
  },

  dashboardButtonTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 3,
  },

  dashboardButtonSubtitle: {
    color: '#BEBEBE',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
});