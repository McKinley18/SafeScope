import { Image, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import { tokens } from '../../theme/tokens';

type Props = {
  section?: string;
};

export default function AppBanner({ section = 'Safety Intelligence Suite' }: Props) {
  const { colors, dark } = useAppTheme();

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.brandRow}>
        <View
          style={[
            styles.logoPlate,
            {
              backgroundColor: dark ? '#0F1115' : '#FFFFFF',
              borderColor: colors.border,
            },
          ]}
        >
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.brandTextWrap}>
          <Text style={[styles.brandName, { color: colors.text }]}>SafeScope</Text>
          <Text style={[styles.brandSub, { color: colors.sub }]}>{section}</Text>
        </View>

        <View style={styles.statusWrap}>
          <View style={[styles.statusDot, { backgroundColor: colors.accent }]} />
          <Text style={[styles.statusText, { color: colors.muted }]}>Online</Text>
        </View>
      </View>

      <View style={[styles.accentLine, { backgroundColor: colors.accent }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderWidth: 1,
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
    overflow: 'hidden',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  logoPlate: {
    width: 58,
    height: 58,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 52,
    height: 52,
  },
  brandTextWrap: {
    flex: 1,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  brandSub: {
    marginTop: 2,
    fontSize: tokens.type.small,
    fontWeight: '700',
  },
  statusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  accentLine: {
    height: 3,
    borderRadius: 999,
    marginTop: tokens.spacing.md,
  },
});
