import { Colors, ColorScheme } from './colors';

export const themes = {
  light: {
    ...Colors.light,
    isDark: false as const,
  },
  dark: {
    ...Colors.dark,
    isDark: true as const,
  },
};

export type Theme = typeof themes.light;

export function getTheme(scheme: ColorScheme): Theme {
  return themes[scheme] || themes.light;
}

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  sizes: {
    xs: 10, sm: 12, md: 14, lg: 16, xl: 18, xxl: 22, xxxl: 28, hero: 36,
  },
};

export const SPACING = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, huge: 48,
};

export const RADIUS = {
  sm: 6, md: 10, lg: 14, xl: 20, round: 999,
};

export const SHADOWS = {
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  md: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5 },
};
