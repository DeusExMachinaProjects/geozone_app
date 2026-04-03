import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  headerBlock: {
    marginBottom: 14,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    color: '#B5B5B5',
    fontSize: 15,
  },
  mapCard: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#0B0B0B',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1B1B1B',
  },
  map: {
    flex: 1,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapOverlayText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  mapHint: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.70)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  mapHintText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    columnGap: 10,
    marginBottom: 12,
  },
  statCard: {
    width: '48.5%',
    backgroundColor: '#101010',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  cardLabel: {
    color: '#A9A9A9',
    fontSize: 13,
    marginBottom: 8,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  statValueSmall: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  errorCard: {
    backgroundColor: 'rgba(166, 27, 27, 0.18)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(166, 27, 27, 0.45)',
    marginBottom: 10,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 'auto',
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resumeButton: {
    backgroundColor: '#1E8449',
  },
  pauseButton: {
    backgroundColor: '#2A2A2A',
  },
  finishButton: {
    backgroundColor: '#C11A1A',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  summaryBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.62)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: '#111111',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#1F1F1F',
  },
  summaryTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 18,
    textAlign: 'center',
  },
  summaryMetrics: {
    gap: 12,
    marginBottom: 22,
  },
  summaryMetric: {
    backgroundColor: '#181818',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  summaryLabel: {
    color: '#A9A9A9',
    fontSize: 13,
    marginBottom: 6,
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  summaryActions: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryButtonSecondary: {
    backgroundColor: '#242424',
  },
  summaryButtonPrimary: {
    backgroundColor: '#FF6B52',
  },
  summaryButtonSecondaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  summaryButtonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});