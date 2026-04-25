import { StyleSheet, Text, View } from 'react-native';
import { tokens } from '../../theme/tokens';

export default function PageBanner({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.banner}>
      <Text style={styles.kicker}>{kicker}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#0b1120',
    marginHorizontal: -tokens.spacing.md,
    marginTop: -tokens.spacing.md,
    paddingHorizontal: tokens.spacing.md,
    paddingTop: 22,
    paddingBottom: 20,
    marginBottom: 20,
  },
  kicker: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.7,
  },
  subtitle: {
    color: '#cbd5e1',
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
});
