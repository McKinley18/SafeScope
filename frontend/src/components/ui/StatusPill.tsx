import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../../theme/ThemeContext';

export default function StatusPill({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}) {
  const { colors } = useAppTheme();

  const toneColor =
    tone === 'success' ? '#10b981' :
    tone === 'warning' ? '#f59e0b' :
    tone === 'danger' ? '#ef4444' :
    colors.accent;

  return (
    <View style={[styles.pill, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
      <View style={[styles.dot, { backgroundColor: toneColor }]} />
      <Text style={[styles.text, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
  },
  text: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'capitalize',
  },
});
