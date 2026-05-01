import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#050505',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 120,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  backButton: {
    width: 44,
    height: 44,
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

  kicker: {
    color: '#FF6B52',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
  },

  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(255,107,82,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,82,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroCard: {
    backgroundColor: '#111111',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#242424',
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  heroLabel: {
    color: '#B9B9B9',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
  },

  heroValue: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '900',
    lineHeight: 46,
  },

  heroDetail: {
    color: '#FF6B52',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 8,
  },

  circleProgress: {
    width: 98,
    height: 98,
    borderRadius: 49,
    borderWidth: 10,
    borderColor: '#FF6B52',
    backgroundColor: '#181818',
    alignItems: 'center',
    justifyContent: 'center',
  },

  circleProgressValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },

  circleProgressLabel: {
    color: '#BEBEBE',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },

  goalCard: {
    backgroundColor: '#111111',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#242424',
    padding: 18,
    marginBottom: 18,
  },

  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },

  sectionBadge: {
    color: '#FFB703',
    fontSize: 11,
    fontWeight: '900',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,183,3,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,183,3,0.26)',
    overflow: 'hidden',
  },

  progressTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: '#252525',
    overflow: 'hidden',
    marginBottom: 12,
  },

  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#FF6B52',
  },

  goalText: {
    color: '#C7C7C7',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },

  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  metricCard: {
    width: '48%',
    minHeight: 168,
    backgroundColor: '#111111',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#242424',
    padding: 16,
    marginBottom: 14,
  },

  metricIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  metricIcon_orange: {
    backgroundColor: '#FF6B52',
  },

  metricIcon_gold: {
    backgroundColor: '#E8A020',
  },

  metricIcon_blue: {
    backgroundColor: '#367CFF',
  },

  metricIcon_green: {
    backgroundColor: '#1C9B5F',
  },

  metricIcon_red: {
    backgroundColor: '#F44336',
  },

  metricValue: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '900',
    marginBottom: 4,
  },

  metricLabel: {
    color: '#CFCFCF',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
  },

  metricDetail: {
    color: '#898989',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
  },

  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#111111',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#242424',
    padding: 16,
    marginTop: 2,
    marginBottom: 14,
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: '#181818',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  infoTextBlock: {
    flex: 1,
  },

  infoTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 6,
  },

  infoText: {
    color: '#BEBEBE',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
  },
});