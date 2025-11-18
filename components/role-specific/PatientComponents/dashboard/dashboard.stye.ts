import {
  BorderRadius,
  BrandColors,
  FontSizes,
  FontWeights,
  NeutralColors,
  Spacing,
} from '@/constants';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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

  //   speciality
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
});

export default styles;
