/**
 * Card Component Styles
 */

import { StyleSheet } from 'react-native';
import { BorderRadius, Spacing, Shadows, NeutralColors } from '@/constants/theme';

export const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    backgroundColor: NeutralColors.white,
  },

  // Variants
  defaultCard: {
    // No shadow, just background
  },
  elevatedCard: {
    ...Shadows.md,
  },
  outlinedCard: {
    borderWidth: 1,
    borderColor: NeutralColors.gray200,
  },

  // Padding
  noPadding: {
    padding: 0,
  },
  smallPadding: {
    padding: Spacing.sm,
  },
  mediumPadding: {
    padding: Spacing.md,
  },
  largePadding: {
    padding: Spacing.lg,
  },
});

