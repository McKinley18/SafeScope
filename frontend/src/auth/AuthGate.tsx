import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppTheme } from '../theme/ThemeContext';
import { apiClient } from '../api/client';

const AUTH_TOKEN_KEY = 'safescope_auth_token_v1';
const AUTH_USER_KEY = 'safescope_auth_user_v1';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { colors } = useAppTheme();
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantId, setTenantId] = useState('default');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      setAuthenticated(!!token);
      setReady(true);
    };

    loadSession();
  }, []);

  const submit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing information', 'Enter your email and password.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Password too short', 'Use at least 6 characters.');
      return;
    }

    try {
      setLoading(true);

      const result =
        mode === 'login'
          ? await apiClient.login({ email, password })
          : await apiClient.register({ email, password, tenantId });

      if (!result?.token) {
        Alert.alert('Authentication failed', result?.message || 'Unable to continue.');
        return;
      }

      await AsyncStorage.setItem(AUTH_TOKEN_KEY, result.token);
      await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(result.user || {}));
      setAuthenticated(true);
    } catch (error: any) {
      Alert.alert('Authentication failed', error?.message || 'Unable to continue.');
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (authenticated) return <>{children}</>;

  return (
    <View style={[styles.wrap, { backgroundColor: colors.bg }]}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />

        <Text style={[styles.title, { color: colors.text }]}>
          {mode === 'login' ? 'Sign in to SafeScope' : 'Create your SafeScope account'}
        </Text>

        <Text style={[styles.subtitle, { color: colors.sub }]}>
          Secure access for inspections, reports, corrective actions, and local vault recovery.
        </Text>

        <TextInput
          style={[styles.input, { backgroundColor: colors.cardAlt, borderColor: colors.border, color: colors.text }]}
          placeholder="Email"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={[styles.input, { backgroundColor: colors.cardAlt, borderColor: colors.border, color: colors.text }]}
          placeholder="Password"
          placeholderTextColor={colors.muted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {mode === 'register' && (
          <TextInput
            style={[styles.input, { backgroundColor: colors.cardAlt, borderColor: colors.border, color: colors.text }]}
            placeholder="Company / Tenant ID"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            value={tenantId}
            onChangeText={setTenantId}
          />
        )}

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent }]} onPress={submit} disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
          style={styles.switchButton}
        >
          <Text style={[styles.switchText, { color: colors.accent }]}>
            {mode === 'login' ? 'Create a new account' : 'Already have an account? Sign in'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrap: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 22,
  },
  logo: {
    width: 230,
    height: 115,
    alignSelf: 'center',
    marginBottom: -8,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 18,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  button: {
    minHeight: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
  },
  switchButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  switchText: {
    fontSize: 13,
    fontWeight: '900',
  },
});
