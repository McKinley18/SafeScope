import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../theme/ThemeContext';

export default function AppFooter() {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: colors.cardAlt,
          borderTopColor: colors.border,
        },
      ]}
    >
      <View style={[styles.accent, { backgroundColor: colors.accent }]} />

      <Text style={[styles.brand, { color: colors.text }]}>
        SafeScope
      </Text>

      <Text style={[styles.sub, { color: colors.sub }]}>
        Operational Safety Intelligence
      </Text>

      <Text style={[styles.meta, { color: colors.muted }]}>
        Version 0.1.0 • © 2026 SafeScope
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 28,
    paddingTop: 18,
    paddingBottom: 110,
    paddingHorizontal: 18,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  accent: {
    width: 54,
    height: 4,
    borderRadius: 99,
    marginBottom: 14,
  },
  brand: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
  },
  sub: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  meta: {
    fontSize: 11,
    fontWeight: '600',
  },
});
