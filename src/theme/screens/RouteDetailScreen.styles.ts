import {StyleSheet} from 'react-native';
import {spacing} from '..';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#050505',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 54,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: '#050505',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#242424',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  headerTextBlock: {
    flex: 1,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },

  headerSubtitle: {
    color: 'rgba(255,255,255,0.58)',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
  },

  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 130,
  },

  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },

  centerStateTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
    marginTop: 12,
    marginBottom: 6,
  },

  centerStateText: {
    color: '#BEBEBE',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },

  retryButton: {
    marginTop: 18,
    backgroundColor: '#FF6B52',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  mapCard: {
    height: 300,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: 'rgba(255,107,82,0.28)',
    marginBottom: spacing.md,
  },

  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#1F1F1F',
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: '#FF6B52',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  summaryTextBlock: {
    flex: 1,
  },

  activityTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    textTransform: 'capitalize',
  },

  activityDate: {
    color: '#AFAFAF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },

  distancePill: {
    minWidth: 72,
    borderRadius: 18,
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: 'rgba(255,107,82,0.24)',
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
  },

  distancePillValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },

  distancePillUnit: {
    color: '#FF6B52',
    fontSize: 11,
    fontWeight: '900',
    marginTop: 1,
  },

  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  metricCard: {
    width: '48%',
    minHeight: 126,
    backgroundColor: '#111111',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1F1F1F',
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  metricIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: '#FF6B52',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  metricLabel: {
    color: '#BEBEBE',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
  },

  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },

  metricValue: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '900',
  },

  metricUnit: {
    color: '#FF6B52',
    fontSize: 11,
    fontWeight: '900',
    marginLeft: 5,
    marginBottom: 4,
  },

  sectionCard: {
    backgroundColor: '#111111',
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#1F1F1F',
    padding: spacing.lg,
    marginBottom: spacing.md,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: spacing.md,
  },

  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  weatherMainIcon: {
    width: 54,
    height: 54,
    borderRadius: 20,
    backgroundColor: '#FF6B52',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  weatherTextBlock: {
    flex: 1,
  },

  weatherTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  weatherSubtitle: {
    color: '#AFAFAF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 5,
    lineHeight: 18,
  },

  techRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#202020',
  },

  techLabel: {
    color: '#AFAFAF',
    fontSize: 13,
    fontWeight: '800',
  },

  techValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    maxWidth: '58%',
    textAlign: 'right',
  },
});