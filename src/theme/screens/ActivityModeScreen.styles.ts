import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 18,
    backgroundColor: '#050505',
  },

  header: {
    marginBottom: 12,
  },

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#1F1F1F',
  },

  backButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 10,
    borderWidth: 1,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#B8B8B8',
  },

  cardsGroup: {
    flex: 1,
    gap: 10,
  },

  card: {
    backgroundColor: '#111111',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: '#1E1E1E',
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  cardAccent: {
    width: 6,
    height: 22,
    borderRadius: 99,
    marginRight: 10,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    flex: 1,
  },

  cardText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#D0D0D0',
    marginBottom: 6,
  },

  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 7,
  },

  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 99,
    marginTop: 5,
    marginRight: 10,
  },

  bulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: '#D0D0D0',
  },

  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },

  metricPill: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#0D0D0D',
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },

  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E8E',
    marginBottom: 4,
  },

  metricValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  primaryButton: {
    marginTop: 12,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    fontSize: 14,
    fontWeight: '800',
  },

  helperText: {
    marginTop: 9,
    fontSize: 12,
    lineHeight: 17,
    color: '#8F8F8F',
  },
});
