import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';

export default function AppCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
});
