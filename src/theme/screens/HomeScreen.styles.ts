import {Dimensions, StyleSheet} from 'react-native';
import {spacing} from '..';

const {height: screenHeight} = Dimensions.get('window');

const isShortScreen = screenHeight <= 820;
const isVeryShortScreen = screenHeight <= 760;

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#050505',
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },

  profileBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: spacing.sm,
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#1A1A1A',
    borderWidth: 2,
    borderColor: '#2E2E2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },

  profileInfo: {
    flex: 1,
  },

  welcome: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 2,
  },

  location: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },

  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  levelBadge: {
    backgroundColor: '#FF5B36',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },

  levelBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  miniBadge: {
    backgroundColor: '#161616',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#262626',
    marginRight: 6,
    marginBottom: 6,
  },

  miniBadgeText: {
    color: '#D8D8D8',
    fontSize: 10,
    fontWeight: '700',
  },

  notificationButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#131313',
    borderWidth: 1,
    borderColor: '#242424',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },

  notificationIcon: {
    fontSize: 18,
  },

  statsCard: {
    backgroundColor: '#FF6A39',
    borderRadius: 22,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  statValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
    textAlign: 'center',
  },

  statLabel: {
    color: '#FFF4EE',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 14,
  },

  rankCard: {
    backgroundColor: '#111111',
    borderRadius: 22,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#1D1D1D',
    marginBottom: spacing.lg,
  },

  rankTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  rankLevelBadge: {
    backgroundColor: '#FF5B36',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },

  rankLevelBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  rankTitle: {
    color: '#D9D9D9',
    fontSize: 14,
    fontWeight: '700',
  },

  xpLeft: {
    color: '#D0D0D0',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
  },

  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#252525',
    overflow: 'hidden',
    marginBottom: 8,
  },

  progressFill: {
    width: '64%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#FF6A39',
  },

  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  progressHint: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 10,
    fontWeight: '700',
  },

  progressMax: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 10,
    fontWeight: '800',
  },

  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 2,
  },

  actionCard: {
    width: '48.2%',
    backgroundColor: '#121212',
    borderRadius: 22,
    height: isVeryShortScreen ? 98 : isShortScreen ? 108 : 118,
    paddingVertical: isVeryShortScreen ? 10 : 12,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isVeryShortScreen ? 10 : 12,
    borderWidth: 1,
    borderColor: '#1D1D1D',
  },

  actionIcon: {
    fontSize: isVeryShortScreen ? 26 : isShortScreen ? 28 : 30,
    marginBottom: isVeryShortScreen ? 6 : 8,
  },

  actionTitle: {
    color: '#F4F4F4',
    fontSize: isVeryShortScreen ? 15 : isShortScreen ? 16 : 18,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});