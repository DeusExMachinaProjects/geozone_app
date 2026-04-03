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
  optionCard: {
    backgroundColor: '#101010',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1E1E1E',
  },
  optionTitle: {
    color: '#52E8FF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  optionText: {
    color: '#E8E8E8',
    fontSize: 15,
    lineHeight: 22,
  },
});