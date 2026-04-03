import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#050505',
    gap: 16,
  },
  header: {
    marginTop: 8,
    marginBottom: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#1f1f1f',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    color: '#A7A7A7',
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#101010',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1E1E1E',
  },
  cardTitle: {
    color: '#78E35E',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  cardText: {
    color: '#E8E8E8',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: '#78E35E',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#050505',
    fontSize: 16,
    fontWeight: '800',
  },
});