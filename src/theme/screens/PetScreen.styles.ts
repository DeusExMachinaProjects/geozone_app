import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: '#050505',
  },

  header: {
    marginBottom: 10,
  },

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#1f1f1f',
  },

  backButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 19,
    color: '#B8B8B8',
  },

  cardsGroup: {
    flex: 1,
    justifyContent: 'space-between',
  },

  card: {
    backgroundColor: '#111111',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#1E1E1E',
    marginBottom: 10,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },

  cardText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#D0D0D0',
    marginBottom: 4,
  },

  primaryButton: {
    marginTop: 10,
    backgroundColor: '#FF6B52',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});