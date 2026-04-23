/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#111827',
    background: '#f8fafc',
    card: '#ffffff',
    cardAlt: '#f1f5f9',
    border: '#e5e7eb',
    subtext: '#475569',
    muted: '#64748b',
    tint: '#ff6a00',
    icon: '#64748b',
    tabIconDefault: '#64748b',
    tabIconSelected: '#ff6a00',
  },
  dark: {
    text: '#ffffff',
    background: '#050505',
    card: '#111111',
    cardAlt: '#171717',
    border: '#232323',
    subtext: '#cbd5e1',
    muted: '#9ca3af',
    tint: '#ff6a00',
    icon: '#9ca3af',
    tabIconDefault: '#9ca3af',
    tabIconSelected: '#ff6a00',
  },
}

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
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
