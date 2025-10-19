/**
 * Hospital Management App Theme Configuration
 * Modern, clean design with medical-friendly colors
 */

import { Platform } from 'react-native';

// Primary Brand Colors - Modern Medical Theme
export const BrandColors = {
  primary: '#4B7BEC', // Vibrant Blue
  primaryDark: '#3867D6',
  primaryLight: '#6C8EF7',

  secondary: '#5F27CD', // Purple accent
  secondaryDark: '#4B1F9E',
  secondaryLight: '#8854D0',

  accent: '#00D2D3', // Teal
  accentDark: '#00A8A9',
  accentLight: '#26E2E3',
};

// Status Colors
export const StatusColors = {
  success: '#26DE81',
  successDark: '#20BF6B',
  successLight: '#3EED8F',

  warning: '#FD9644',
  warningDark: '#FC7F23',
  warningLight: '#FEA65B',

  error: '#FC5C65',
  errorDark: '#EB3B5A',
  errorLight: '#FD7380',

  info: '#45AAF2',
  infoDark: '#2D98DA',
  infoLight: '#5EBEF9',
};

// Neutral Colors
export const NeutralColors = {
  white: '#FFFFFF',
  black: '#000000',

  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
};

// Theme Colors
export const Colors = {
  light: {
    // Basic
    text: NeutralColors.gray900,
    textSecondary: NeutralColors.gray600,
    textTertiary: NeutralColors.gray500,
    background: NeutralColors.white,
    backgroundSecondary: NeutralColors.gray50,

    // Brand
    primary: BrandColors.primary,
    primaryDark: BrandColors.primaryDark,
    primaryLight: BrandColors.primaryLight,

    secondary: BrandColors.secondary,
    accent: BrandColors.accent,

    // Status
    success: StatusColors.success,
    warning: StatusColors.warning,
    error: StatusColors.error,
    info: StatusColors.info,

    // UI Elements
    border: NeutralColors.gray200,
    borderLight: NeutralColors.gray100,
    card: NeutralColors.white,
    cardShadow: 'rgba(0, 0, 0, 0.05)',

    // Icons & Tabs
    icon: NeutralColors.gray600,
    iconActive: BrandColors.primary,
    tabIconDefault: NeutralColors.gray400,
    tabIconSelected: BrandColors.primary,

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.4)',
    overlayLight: 'rgba(0, 0, 0, 0.2)',

    // Specialty colors
    specialtyBg: '#EFF3FF',
  },
  dark: {
    // Basic
    text: NeutralColors.gray100,
    textSecondary: NeutralColors.gray400,
    textTertiary: NeutralColors.gray500,
    background: NeutralColors.gray900,
    backgroundSecondary: NeutralColors.gray800,

    // Brand
    primary: BrandColors.primaryLight,
    primaryDark: BrandColors.primary,
    primaryLight: BrandColors.primaryLight,

    secondary: BrandColors.secondaryLight,
    accent: BrandColors.accentLight,

    // Status
    success: StatusColors.successLight,
    warning: StatusColors.warningLight,
    error: StatusColors.errorLight,
    info: StatusColors.infoLight,

    // UI Elements
    border: NeutralColors.gray700,
    borderLight: NeutralColors.gray800,
    card: NeutralColors.gray800,
    cardShadow: 'rgba(0, 0, 0, 0.3)',

    // Icons & Tabs
    icon: NeutralColors.gray400,
    iconActive: BrandColors.primaryLight,
    tabIconDefault: NeutralColors.gray500,
    tabIconSelected: BrandColors.primaryLight,

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.6)',
    overlayLight: 'rgba(0, 0, 0, 0.4)',

    // Specialty colors
    specialtyBg: NeutralColors.gray700,
  },
};

// Typography
export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
};

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const LineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

// Spacing
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64,
};

// Border Radius
export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

// Shadows
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Layout
export const Layout = {
  maxWidth: 600,
  containerPadding: Spacing.md,
  headerHeight: 60,
  tabBarHeight: 60,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
