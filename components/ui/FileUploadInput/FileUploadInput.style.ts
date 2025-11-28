import {
    BrandColors,
    FontSizes,
    FontWeights,
    NeutralColors,
    Spacing,
} from '@/constants/theme';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs,
    color: NeutralColors.gray700,
  },
  helperText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.normal,
    color: NeutralColors.gray500,
  },
  uploadSection: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  imageContainer: {
    position: 'relative',
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: NeutralColors.gray300,
    backgroundColor: NeutralColors.gray100,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NeutralColors.gray100,
  },
  placeholderText: {
    marginTop: Spacing.xs,
    fontSize: FontSizes.xs,
    color: NeutralColors.gray500,
    textAlign: 'center',
  },
  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 75,
  },
  uploadText: {
    marginTop: Spacing.xs,
    fontSize: FontSizes.sm,
    color: '#FFFFFF',
    fontWeight: FontWeights.medium,
  },
  uploadButton: {
    minWidth: 150,
  },
  errorText: {
    fontSize: FontSizes.xs,
    color: BrandColors.error || '#EF4444',
    marginTop: Spacing.xs,
  },
});

export default styles;
