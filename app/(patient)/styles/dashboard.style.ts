/**
 * Patient Dashboard Styles
 */

import { StyleSheet } from 'react-native';
import { Spacing, FontSizes, FontWeights, NeutralColors, BrandColors, BorderRadius } from '@/constants/theme';

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

  // Banner Section
  bannerSection: {
    paddingLeft: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  banner: {
    width: 340,
    height: 180,
    borderRadius: BorderRadius.xl,
    backgroundColor: BrandColors.primary,
    padding: Spacing.lg,
    marginRight: Spacing.md,
    overflow: 'hidden',
  },
  bannerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.3,
  },
  bannerContent: {
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  bannerTitle: {
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.bold,
    color: NeutralColors.white,
    marginBottom: Spacing.sm,
  },
  bannerDescription: {
    fontSize: FontSizes.sm,
    color: NeutralColors.white,
    opacity: 0.95,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  bannerButton: {
    alignSelf: 'flex-start',
    backgroundColor: NeutralColors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  bannerButtonText: {
    color: BrandColors.primary,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  bannerImage: {
    position: 'absolute',
    right: -20,
    bottom: 0,
    width: 200,
    height: 200,
  },
  bannerDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: NeutralColors.gray300,
  },
  activeDot: {
    width: 24,
    backgroundColor: BrandColors.primary,
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
  specialtyCard: {
    width: '23%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  specialtyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    backgroundColor: '#EFF3FF',
  },
  specialtyName: {
    fontSize: FontSizes.xs,
    textAlign: 'center',
    color: NeutralColors.gray700,
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

