/**
 * Input Component Styles
 */

import { StyleSheet } from 'react-native';
import { BorderRadius, Spacing, FontSizes, FontWeights, NeutralColors, StatusColors } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: NeutralColors.gray300,
    borderRadius: BorderRadius.lg,
    backgroundColor: NeutralColors.white,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: FontSizes.md,
    paddingHorizontal: Spacing.md,
  },
  inputWithLeftIcon: {
    paddingLeft: Spacing.sm,
  },
  inputWithRightIcon: {
    paddingRight: Spacing.sm,
  },
  inputError: {
    borderColor: StatusColors.error,
    borderWidth: 1.5,
  },
  leftIcon: {
    paddingLeft: Spacing.md,
  },
  rightIcon: {
    paddingRight: Spacing.md,
  },
  errorText: {
    fontSize: FontSizes.sm,
    color: StatusColors.error,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  helperText: {
    fontSize: FontSizes.sm,
    color: NeutralColors.gray500,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});

