import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 36,
    backgroundColor: '#050505',
  },

  header: {
    marginBottom: 22,
  },

  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
    borderRadius: 12,
    backgroundColor: '#11181b',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  backButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },

  title: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 8,
  },

  subtitle: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 15,
    lineHeight: 22,
  },

  optionCard: {
    backgroundColor: '#11181b',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  optionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },

  optionText: {
    color: 'rgba(255,255,255,0.74)',
    fontSize: 14,
    lineHeight: 21,
  },

  logoutCard: {
    backgroundColor: 'rgba(255,91,10,0.08)',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,91,10,0.28)',
  },

  logoutTitle: {
    color: '#ff6b18',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },

  logoutText: {
    color: 'rgba(255,255,255,0.74)',
    fontSize: 14,
    lineHeight: 21,
  },

  pressed: {
    opacity: 0.9,
    transform: [{scale: 0.99}],
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#11181b',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  modalTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 10,
  },

  modalText: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 22,
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },

  modalSecondaryButton: {
    minHeight: 46,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },

  modalSecondaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },

  modalPrimaryButton: {
    minHeight: 46,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff5b0a',
  },

  modalPrimaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});