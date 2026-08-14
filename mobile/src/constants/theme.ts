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
