import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '../../theme/ThemeContext';

export default function Surface({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.surface, { backgroundColor: colors.card, borderColor: colors.border }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  surface: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
});
