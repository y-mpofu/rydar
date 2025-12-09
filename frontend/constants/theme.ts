/**
 * Rydar Design System
 * Fresh Cyan aesthetic with modern system typography
 */

import { Platform, TextStyle, ViewStyle } from 'react-native';

// ============================================
// COLOR PALETTE
// ============================================

export const Colors = {
  // Primary - Fresh Cyan/Teal
  primary: {
    main: '#06B6D4',
    light: '#22D3EE',
    dark: '#0891B2',
    gradient: ['#0891B2', '#06B6D4', '#22D3EE'] as const,
  },

  // Accent Colors
  accent: {
    cyan: '#67E8F9',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },

  // Background
  background: {
    dark: '#0F172A',
    darkSecondary: '#1E293B',
    light: '#F8FAFC',
    lightSecondary: '#F1F5F9',
    gradient: ['#0F172A', '#1E293B'] as const,
    gradientLight: ['#FFFFFF', '#F8FAFC', '#E0F2FE'] as const,
  },

  // Surface (Cards, Modals)
  surface: {
    glass: 'rgba(255, 255, 255, 0.98)',
    glassDark: 'rgba(15, 23, 42, 0.9)',
    card: '#FFFFFF',
    cardDark: '#1E293B',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Text
  text: {
    primary: '#0F172A',
    secondary: '#64748B',
    tertiary: '#94A3B8',
    inverse: '#FFFFFF',
    link: '#06B6D4',
  },

  // Border
  border: {
    light: '#E2E8F0',
    medium: '#CBD5E1',
    focus: '#06B6D4',
  },

  // Legacy support
  light: {
    text: '#0F172A',
    background: '#F8FAFC',
    tint: '#06B6D4',
    icon: '#64748B',
    tabIconDefault: '#64748B',
    tabIconSelected: '#06B6D4',
  },
  dark: {
    text: '#F8FAFC',
    background: '#0F172A',
    tint: '#22D3EE',
    icon: '#94A3B8',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#22D3EE',
  },
};

// ============================================
// TYPOGRAPHY
// ============================================

// Font weights for system font
export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
};

export const Typography = {
  // Using system font (SF Pro on iOS, Roboto on Android)
  fontFamily: {
    regular: Platform.select({ ios: 'System', default: 'System' }),
    medium: Platform.select({ ios: 'System', default: 'System' }),
    semiBold: Platform.select({ ios: 'System', default: 'System' }),
    bold: Platform.select({ ios: 'System', default: 'System' }),
  },

  fontWeight: FontWeights,

  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Pre-built text styles
export const TextStyles: Record<string, TextStyle> = {
  hero: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: FontWeights.bold,
    fontSize: Typography.fontSize['5xl'],
    lineHeight: Typography.fontSize['5xl'] * Typography.lineHeight.tight,
    color: Colors.text.primary,
  },
  h1: {
    fontFamily: Typography.fontFamily.bold,
    fontWeight: FontWeights.bold,
    fontSize: Typography.fontSize['3xl'],
    lineHeight: Typography.fontSize['3xl'] * Typography.lineHeight.tight,
    color: Colors.text.primary,
  },
  h2: {
    fontFamily: Typography.fontFamily.semiBold,
    fontWeight: FontWeights.semiBold,
    fontSize: Typography.fontSize['2xl'],
    lineHeight: Typography.fontSize['2xl'] * Typography.lineHeight.tight,
    color: Colors.text.primary,
  },
  h3: {
    fontFamily: Typography.fontFamily.semiBold,
    fontWeight: FontWeights.semiBold,
    fontSize: Typography.fontSize.xl,
    lineHeight: Typography.fontSize.xl * Typography.lineHeight.normal,
    color: Colors.text.primary,
  },
  body: {
    fontFamily: Typography.fontFamily.regular,
    fontWeight: FontWeights.regular,
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
    color: Colors.text.primary,
  },
  bodyMedium: {
    fontFamily: Typography.fontFamily.medium,
    fontWeight: FontWeights.medium,
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
    color: Colors.text.primary,
  },
  caption: {
    fontFamily: Typography.fontFamily.regular,
    fontWeight: FontWeights.regular,
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
    color: Colors.text.secondary,
  },
  button: {
    fontFamily: Typography.fontFamily.semiBold,
    fontWeight: FontWeights.semiBold,
    fontSize: Typography.fontSize.base,
    color: Colors.text.inverse,
  },
  label: {
    fontFamily: Typography.fontFamily.medium,
    fontWeight: FontWeights.medium,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
};

// ============================================
// SPACING
// ============================================

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
};

// ============================================
// BORDER RADIUS
// ============================================

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

// ============================================
// SHADOWS
// ============================================

export const Shadows: Record<string, ViewStyle> = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  glow: {
    shadowColor: Colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  glowCyan: {
    shadowColor: Colors.accent.cyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
};

// ============================================
// COMPONENT PRESETS
// ============================================

export const ComponentStyles = {
  // Glass card effect
  glassCard: {
    backgroundColor: Colors.surface.glass,
    borderRadius: BorderRadius.xl,
    ...Shadows.lg,
  } as ViewStyle,

  // Input field
  input: {
    backgroundColor: Colors.background.light,
    borderWidth: 1.5,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontFamily: Typography.fontFamily.regular,
    fontWeight: FontWeights.regular,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
  } as ViewStyle & TextStyle,

  inputFocused: {
    borderColor: Colors.primary.main,
    ...Shadows.glow,
  } as ViewStyle,

  // Primary button
  buttonPrimary: {
    backgroundColor: Colors.primary.main,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    ...Shadows.glow,
  } as ViewStyle,

  // Secondary button
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary.main,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg - 2,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  } as ViewStyle,

  // Modal overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.surface.overlay,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  } as ViewStyle,

  // Modal card
  modalCard: {
    width: '90%',
    backgroundColor: Colors.surface.card,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing['2xl'],
    ...Shadows.xl,
  } as ViewStyle,
};

// ============================================
// LEGACY FONTS SUPPORT
// ============================================

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'System',
    serif: 'serif',
    rounded: 'System',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "system-ui, -apple-system, sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
});
