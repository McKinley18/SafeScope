import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import { tokens } from '../../theme/tokens';

type Variant = 'primary' | 'secondary';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  style?: ViewStyle | ViewStyle[];
};

export default function AppButton({
  label,
  onPress,
  variant = 'primary',
  style,
}: Props) {
  const { colors } = useAppTheme();
  const primary = variant === 'primary';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: primary ? colors.accent : colors.cardAlt,
          borderColor: primary ? colors.accent : colors.border,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: primary ? '#FFFFFF' : colors.text },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.lg,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
  },
});
