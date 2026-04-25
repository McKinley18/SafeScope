import { Image, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import { tokens } from '../../theme/tokens';

export default function BrandedHeader({
  title,
  subtitle,
  showLogo = false,
}: {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
}) {
  const { dark } = useAppTheme();

  return (
    <View style={[styles.header, { backgroundColor: dark ? '#05070D' : '#0B1120' }]}>
      {showLogo ? (
        <Image
          source={require('../../../assets/images/logo-header.png')}
          resizeMode="contain"
          style={styles.logo}
        />
      ) : null}

      <Text style={styles.title}>{title}</Text>

      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginHorizontal: -tokens.spacing.md,
    marginTop: -tokens.spacing.md,
    paddingHorizontal: tokens.spacing.md,
    paddingTop: 22,
    paddingBottom: 22,
    marginBottom: 22,
  },
  logo: {
    width: '140%',
    height: 180,
    maxWidth: 1200,
    alignSelf: 'center',
    marginTop: -34,
    marginBottom: -28,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  subtitle: {
    color: '#CBD5E1',
    marginTop: 7,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
});
