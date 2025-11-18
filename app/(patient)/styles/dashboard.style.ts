/**
 * Patient Dashboard Styles
 */

import {
  BorderRadius,
  BrandColors,
  FontSizes,
  FontWeights,
  NeutralColors,
  Spacing,
} from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NeutralColors.white,
  },
  scrollContent: {
    paddingBottom: Spacing['4xl'],
  },

  // Header
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing['2xl'],
    paddingBottom: Spacing.lg,
    backgroundColor: NeutralColors.white,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: Spacing.md,
    backgroundColor: NeutralColors.gray200,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: FontSizes.sm,
    color: NeutralColors.gray600,
    marginBottom: 2,
  },
  userName: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: NeutralColors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Search Bar
  searchSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
  },
  seeAllButton: {
    paddingVertical: Spacing.xs,
  },
  seeAllText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: BrandColors.primary,
  },

  // Specialty Grid
  specialtyGrid: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  specialtyRow: {
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },

  // Top Doctors Section
  doctorsSection: {
    marginBottom: Spacing.lg,
  },
  doctorFilters: {
    paddingLeft: Spacing.lg,
    marginBottom: Spacing.md,
  },
  filterChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
    borderWidth: 1.5,
    borderColor: NeutralColors.gray300,
    backgroundColor: NeutralColors.white,
  },
  filterChipActive: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primary,
  },
  filterChipText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: NeutralColors.gray700,
  },
  filterChipTextActive: {
    color: NeutralColors.white,
  },
  doctorsList: {
    paddingHorizontal: Spacing.lg,
  },

  // Loading & Empty States
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['2xl'],
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: NeutralColors.gray600,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});

// Default export prevents expo-router from treating this as a route
export default null;
