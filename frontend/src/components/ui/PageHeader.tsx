import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import { tokens } from '../../theme/tokens';

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export default function PageHeader({ eyebrow, title, subtitle }: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.wrap}>
      {eyebrow ? (
        <Text style={[styles.eyebrow, { color: colors.accent }]}>{eyebrow}</Text>
      ) : null}
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.sub }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: tokens.spacing.xl,
  },
  eyebrow: {
    fontSize: tokens.type.small,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: tokens.spacing.xs,
    letterSpacing: 0.8,
  },
  title: {
    fontSize: tokens.type.hero,
    fontWeight: '800',
    marginBottom: tokens.spacing.xs,
  },
  subtitle: {
    fontSize: tokens.type.body,
    lineHeight: 20,
  },
});
