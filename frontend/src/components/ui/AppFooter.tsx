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
        Version 0.1.0 • © 2026 Monolith Studios
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 40,
    paddingTop: 12,
    paddingBottom: 96,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  accent: {
    width: 38,
    height: 3,
    borderRadius: 99,
    marginBottom: 8,
  },
  brand: {
    fontSize: 10,
    fontWeight: '900',
    marginBottom: 2,
  },
  sub: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
  },
  meta: {
    fontSize: 9,
    fontWeight: '600',
  },
});
