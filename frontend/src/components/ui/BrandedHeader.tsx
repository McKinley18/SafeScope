import { Image, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import { tokens } from '../../theme/tokens';

export default function BrandedHeader({
  title,
  subtitle,
  showLogo = true,
}: {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
}) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.wrapper}>
      {showLogo ? (
        <View style={styles.brandHeader}>
          <Image
            source={require('../../../assets/images/logo-final-navy-clean.png')}
            resizeMode="contain"
            style={styles.logo}
          />
        </View>
      ) : null}

      <View style={styles.titleBlock}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, { color: colors.sub }]}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 22,
  },
  brandHeader: {
    backgroundColor: '#081827',
    marginHorizontal: -tokens.spacing.md,
    marginTop: -tokens.spacing.md,
    marginBottom: 20,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 520,
    height: 240,
  },
  titleBlock: {
    marginBottom: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.9,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
    maxWidth: 430,
  },
});
