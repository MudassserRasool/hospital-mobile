/**
 * SearchBar Component Styles
 */

import { StyleSheet } from 'react-native';
import { BorderRadius, Spacing, FontSizes, NeutralColors } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NeutralColors.gray100,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSizes.md,
    height: '100%',
  },
  clearButton: {
    padding: Spacing.xs,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: NeutralColors.gray100,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

