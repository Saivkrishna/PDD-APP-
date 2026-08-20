// @ts-ignore
import '../global.css';
import { Platform } from 'react-native';

export const Colors = {
  light: {
    primary: '#04AA6D',
    secondary: '#04AA6D',
    accent: '#04AA6D',
    background: '#FFFFFF',
    cardBg: '#F1F3F4',
    borderColor: '#E5E5E5',
    textMain: '#000000',
    textSub: '#222222',
    textMuted: '#777777',
    bgContainer: '#F1F3F4',
    inputBg: '#FFFFFF',
    btnBg: '#FFFFFF',
    btnText: '#000000',
    btnBorder: '#000000',
    text: '#000000',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    primary: '#04AA6D',
    secondary: '#04AA6D',
    accent: '#04AA6D',
    background: '#121212',
    cardBg: '#1E1E1E',
    borderColor: '#333333',
    textMain: '#FFFFFF',
    textSub: '#D0D0D0',
    textMuted: '#A0A0A0',
    bgContainer: '#1E1E1E',
    inputBg: '#121212',
    btnBg: '#121212',
    btnText: '#FFFFFF',
    btnBorder: '#FFFFFF',
    text: '#ffffff',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

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
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export const getThemeColors = (themeName: string, darkMode: boolean) => {
  const base = Colors[darkMode ? 'dark' : 'light'];
  const colorsMap: Record<string, { primary: string; secondary: string; accent: string; glow: string }> = {
    cosmic: { primary: '#38bdf8', secondary: '#6366f1', accent: '#38bdf8', glow: 'rgba(56, 189, 248, 0.08)' },
    neon: { primary: '#ec4899', secondary: '#a855f7', accent: '#ec4899', glow: 'rgba(236, 72, 153, 0.08)' },
    emerald: { primary: '#10b981', secondary: '#059669', accent: '#10b981', glow: 'rgba(16, 185, 129, 0.08)' },
    amber: { primary: '#fbbf24', secondary: '#f59e0b', accent: '#fbbf24', glow: 'rgba(251, 191, 36, 0.08)' },
    sapphire: { primary: '#06b6d4', secondary: '#3b82f6', accent: '#06b6d4', glow: 'rgba(6, 182, 212, 0.08)' },
    ruby: { primary: '#f43f5e', secondary: '#e11d48', accent: '#f43f5e', glow: 'rgba(244, 63, 94, 0.08)' },
    orchid: { primary: '#d946ef', secondary: '#8b5cf6', accent: '#d946ef', glow: 'rgba(217, 70, 239, 0.08)' },
    sunset: { primary: '#f97316', secondary: '#ef4444', accent: '#f97316', glow: 'rgba(249, 115, 22, 0.08)' }
  };
  const themeColors = colorsMap[themeName] || colorsMap.cosmic;
  return {
    ...base,
    primary: themeColors.primary,
    secondary: themeColors.secondary,
    accent: themeColors.accent,
    accentGlow: themeColors.glow,
  };
};
