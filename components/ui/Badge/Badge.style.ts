/**
 * Badge Component Styles
 */

import { StyleSheet } from 'react-native';
import { BorderRadius, Spacing, FontSizes, FontWeights, StatusColors, NeutralColors, BrandColors } from '@/constants/theme';

export const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
  },

  // Variants
  successBadge: {
    backgroundColor: `${StatusColors.success}20`,
  },
  warningBadge: {
    backgroundColor: `${StatusColors.warning}20`,
  },
  errorBadge: {
    backgroundColor: `${StatusColors.error}20`,
  },
  infoBadge: {
    backgroundColor: `${StatusColors.info}20`,
  },
  defaultBadge: {
    backgroundColor: NeutralColors.gray200,
  },

  // Sizes
  smallBadge: {
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
  },
  mediumBadge: {
    paddingVertical: 4,
    paddingHorizontal: Spacing.md,
  },
  largeBadge: {
    paddingVertical: 6,
    paddingHorizontal: Spacing.lg,
  },

  // Text
  text: {
    fontWeight: FontWeights.medium,
  },
  successText: {
    color: StatusColors.successDark,
  },
  warningText: {
    color: StatusColors.warningDark,
  },
  errorText: {
    color: StatusColors.errorDark,
  },
  infoText: {
    color: StatusColors.infoDark,
  },
  defaultText: {
    color: NeutralColors.gray700,
  },

  // Text sizes
  smallText: {
    fontSize: FontSizes.xs,
  },
  mediumText: {
    fontSize: FontSizes.sm,
  },
  largeText: {
    fontSize: FontSizes.md,
  },
});

