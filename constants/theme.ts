/**
 * Chow App Theme System
 * Centralized theme configuration for consistent styling across the app
 */

import { Platform } from 'react-native';

// Primary brand colors
const primaryGreen = '#2E7D32'; // Darker shade of green
const primaryGreenLight = '#4CAF50'; // Lighter accent green
const primaryGreenDark = '#1B5E20'; // Darkest green

// Secondary colors
const accentYellow = '#FFD700';
const accentOrange = '#FF9800';

// Neutral colors
const white = '#FFFFFF';
const black = '#000000';
const gray50 = '#FAFAFA';
const gray100 = '#F5F5F5';
const gray200 = '#EEEEEE';
const gray300 = '#E0E0E0';
const gray400 = '#BDBDBD';
const gray500 = '#9E9E9E';
const gray600 = '#757575';
const gray700 = '#616161';
const gray800 = '#424242';
const gray900 = '#212121';

// Status colors
const success = '#4CAF50';
const warning = '#FF9800';
const error = '#F44336';
const info = '#2196F3';

export const Colors = {
  // Brand colors
  primary: primaryGreen,
  primaryLight: primaryGreenLight,
  primaryDark: primaryGreenDark,
  
  // Accent colors
  accent: accentYellow,
  accentOrange: accentOrange,
  
  // Background colors
  background: white,
  backgroundSecondary: gray50,
  backgroundTertiary: gray100,
  
  // Text colors
  text: black,
  textSecondary: gray600,
  textTertiary: gray500,
  textInverse: white,
  
  // Border colors
  border: gray300,
  borderLight: gray200,
  borderDark: gray400,
  
  // Status colors
  success: success,
  warning: warning,
  error: error,
  info: info,
  
  // Legacy support
  light: {
    text: black,
    background: white,
    tint: primaryGreen,
    icon: gray600,
    tabIconDefault: gray600,
    tabIconSelected: primaryGreen,
  },
  dark: {
    text: white,
    background: gray900,
    tint: primaryGreenLight,
    icon: gray400,
    tabIconDefault: gray400,
    tabIconSelected: primaryGreenLight,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  round: 50,
};

export const Typography = {
  // Font sizes
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  xxxxl: 32,
  
  // Font weights - using valid React Native fontWeight values
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const Shadows = {
  sm: {
    shadowColor: black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
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
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
