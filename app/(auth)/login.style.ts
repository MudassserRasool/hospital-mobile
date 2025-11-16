/**
 * Login Screen Styles
 */

import { StyleSheet } from 'react-native';
import { Spacing, FontSizes, FontWeights, NeutralColors } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NeutralColors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
    paddingBottom: Spacing['4xl'],
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing['3xl'],
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes['4xl'],
    fontWeight: FontWeights.bold,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    color: NeutralColors.gray600,
    marginBottom: Spacing['2xl'],
  },
  form: {
    width: '100%',
  },
  loginButton: {
    marginTop: Spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing['2xl'],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: NeutralColors.gray200,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    color: NeutralColors.gray500,
    fontSize: FontSizes.sm,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NeutralColors.white,
    borderWidth: 1.5,
    borderColor: NeutralColors.gray300,
    borderRadius: 12,
    height: 56,
    paddingHorizontal: Spacing.lg,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: Spacing.md,
  },
  googleButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: NeutralColors.gray700,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing['2xl'],
  },
  footerText: {
    fontSize: FontSizes.md,
    color: NeutralColors.gray600,
  },
  linkText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginLeft: Spacing.xs,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: NeutralColors.gray100,
    borderRadius: 12,
    padding: 4,
    marginBottom: Spacing.lg,
  },
  modeButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeButtonActive: {
    backgroundColor: NeutralColors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modeButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: NeutralColors.gray600,
  },
  modeButtonTextActive: {
    fontWeight: FontWeights.semibold,
    color: NeutralColors.gray900,
  },
  guestButton: {
    marginTop: Spacing.md,
  },
});

// Default export prevents expo-router from treating this as a route
export default null;

