/**
 * Button Component Styles
 */

import { StyleSheet } from 'react-native';
import { BrandColors, StatusColors, NeutralColors, BorderRadius, Spacing, FontSizes, FontWeights } from '@/constants/theme';

export const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
  },

  // Variants
  primaryButton: {
    backgroundColor: BrandColors.primary,
  },
  secondaryButton: {
    backgroundColor: BrandColors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: BrandColors.primary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  dangerButton: {
    backgroundColor: StatusColors.error,
  },

  // Sizes
  smallButton: {
    height: 36,
    paddingHorizontal: Spacing.md,
  },
  mediumButton: {
    height: 48,
    paddingHorizontal: Spacing.lg,
  },
  largeButton: {
    height: 56,
    paddingHorizontal: Spacing.xl,
  },

  // Text styles
  text: {
    fontWeight: FontWeights.semibold,
  },
  primaryText: {
    color: NeutralColors.white,
  },
  secondaryText: {
    color: NeutralColors.white,
  },
  outlineText: {
    color: BrandColors.primary,
  },
  ghostText: {
    color: BrandColors.primary,
  },
  dangerText: {
    color: NeutralColors.white,
  },

  // Text sizes
  smallText: {
    fontSize: FontSizes.sm,
  },
  mediumText: {
    fontSize: FontSizes.md,
  },
  largeText: {
    fontSize: FontSizes.lg,
  },

  // States
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  textWithIcon: {
    marginHorizontal: Spacing.sm,
  },
});

