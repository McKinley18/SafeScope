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
  const [mode, setMode] = useState<'login' | 'register'>('register');

  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(AUTH_TOKEN_KEY).then((token) => {
      setAuthenticated(!!token);
      setReady(true);
    });
  }, []);

  const resetSensitiveFields = () => {
    setPassword('');
    setConfirmPassword('');
  };

  const submit = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password.trim()) {
      Alert.alert('Missing information', 'Enter your email and password.');
      return;
    }

    if (mode === 'register') {
      if (!fullName.trim()) {
        Alert.alert('Full name required', 'Enter your full name.');
        return;
      }

      if (!companyName.trim()) {
        Alert.alert('Company name required', 'Enter your company or workspace name.');
        return;
      }

      if (password.length < 8) {
        Alert.alert('Password too short', 'Use at least 8 characters.');
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert('Passwords do not match', 'Confirm your password and try again.');
        return;
      }
    }

    try {
      setLoading(true);

      const result =
        mode === 'login'
          ? await apiClient.login({ email: normalizedEmail, password })
          : await apiClient.register({
              email: normalizedEmail,
              password,
              tenantId: companyName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            });

      if (!result?.token) {
        const message = Array.isArray(result?.message)
          ? result.message.join('\n')
          : result?.message || JSON.stringify(result || {}) || 'Unable to continue.';

        Alert.alert(
          mode === 'login' ? 'Sign in failed' : 'Account creation failed',
          message
        );
        return;
      }

      const user = {
        ...(result.user || {}),
        fullName: fullName.trim(),
        companyName: companyName.trim(),
      };

      await AsyncStorage.setItem(AUTH_TOKEN_KEY, result.token);
      await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
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

        <Text style={[styles.kicker, { color: colors.accent }]}>Secure Workspace Access</Text>

        <Text style={[styles.title, { color: colors.text }]}>
          {mode === 'login' ? 'Welcome back' : 'Create your SafeScope workspace'}
        </Text>

        <Text style={[styles.subtitle, { color: colors.sub }]}>
          {mode === 'login'
            ? 'Sign in to access inspections, reports, corrective actions, and protected local records.'
            : 'Set up a secure company workspace for inspections, reports, and safety intelligence.'}
        </Text>

        {mode === 'register' && (
          <>
            <TextInput
              style={[styles.input, { backgroundColor: colors.cardAlt, borderColor: colors.border, color: colors.text }]}
              placeholder="Full name"
              placeholderTextColor={colors.muted}
              value={fullName}
              onChangeText={setFullName}
            />

            <TextInput
              style={[styles.input, { backgroundColor: colors.cardAlt, borderColor: colors.border, color: colors.text }]}
              placeholder="Company / Workspace name"
              placeholderTextColor={colors.muted}
              value={companyName}
              onChangeText={setCompanyName}
            />
          </>
        )}

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
            placeholder="Confirm password"
            placeholderTextColor={colors.muted}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        )}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.accent, opacity: loading ? 0.7 : 1 }]}
          onPress={submit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Workspace'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            resetSensitiveFields();
            setMode(mode === 'login' ? 'register' : 'login');
          }}
          style={styles.switchButton}
        >
          <Text style={[styles.switchText, { color: colors.accent }]}>
            {mode === 'login' ? 'Create a new workspace' : 'Already have an account? Sign in'}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.securityNote, { color: colors.muted }]}>
          Protected workspace access • Local vault support • Tenant-ready architecture
        </Text>
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
    padding: 18,
  },
  card: {
    borderWidth: 1,
    borderRadius: 26,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  logo: {
    width: 245,
    height: 118,
    alignSelf: 'center',
    marginBottom: -12,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.9,
    marginBottom: 7,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.4,
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
  securityNote: {
    marginTop: 16,
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 15,
  },
});
