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

  heroCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#111111',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,107,82,0.34)',
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },

  heroOverline: {
    color: '#FF6B52',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 8,
  },

  heroTitle: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '900',
    marginBottom: 6,
  },

  heroSubtitle: {
    color: '#BEBEBE',
    fontSize: 13,
    fontWeight: '700',
  },

  progressCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 9,
    borderColor: '#FF6B52',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#181818',
  },

  progressCircleValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },

  progressCircleLabel: {
    color: '#BEBEBE',
    fontSize: 11,
    fontWeight: '800',
  },

  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },

  metricCard: {
    width: '48%',
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
  },

  metricValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },

  metricUnit: {
    color: '#FF6B52',
    fontSize: 12,
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

  weightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  weightItem: {
    width: '31%',
    backgroundColor: '#181818',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
  },

  weightLabel: {
    color: '#AFAFAF',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 6,
  },

  weightValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  progressTrack: {
    height: 11,
    borderRadius: 999,
    backgroundColor: '#272727',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#FF6B52',
  },

  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#202020',
  },

  typeTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    textTransform: 'capitalize',
  },

  typeSubtitle: {
    color: '#AFAFAF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
  },

  typeCalories: {
    color: '#FF6B52',
    fontSize: 14,
    fontWeight: '900',
  },

  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#202020',
  },

  recentIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: '#FF6B52',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  recentTextBlock: {
    flex: 1,
  },

  recentTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'capitalize',
  },

  recentSubtitle: {
    color: '#AFAFAF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
  },

  emptyText: {
    color: '#AFAFAF',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
  },
});