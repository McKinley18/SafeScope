import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppTheme } from '../theme/ThemeContext';
import { apiClient } from '../api/client';

const logoHeader = require('../../assets/images/logo-final-navy-clean.png');

const AUTH_TOKEN_KEY = 'sentinel_safety_auth_token_v1';
const AUTH_USER_KEY = 'sentinel_safety_auth_user_v1';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { colors } = useAppTheme();
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [mode, setMode] = useState<'login' | 'register' | 'recover'>('login');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [workspaceType, setWorkspaceType] = useState<'individual' | 'company' | 'invite'>('individual');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [inviteToken, setInviteToken] = useState('');
  const [resetRequested, setResetRequested] = useState(false);
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

    if (!normalizedEmail || (mode !== 'recover' && !password.trim())) {
      Alert.alert('Missing information', 'Enter your email and password.');
      return;
    }

    if (mode === 'register') {
      if (!firstName.trim() || !lastName.trim()) {
        Alert.alert('Name required', 'Enter your first and last name.');
        return;
      }

      if (workspaceType === 'company' && !companyName.trim()) {
        Alert.alert('Company name required', 'Enter your company or workspace name.');
        return;
      }

      if (workspaceType === 'invite' && !inviteToken.trim()) {
        Alert.alert('Invite code required', 'Enter your company workspace invite code.');
        return;
      }

      const passwordMeetsRequirements =
        password.length >= 8 &&
        /[A-Za-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password);

      if (!passwordMeetsRequirements) {
        Alert.alert(
          'Password requirements not met',
          'Use at least 8 characters, including letters, numbers, and a special character.'
        );
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert('Passwords do not match', 'Confirm your password and try again.');
        return;
      }
    }

    try {
      setLoading(true);

      if (mode === 'recover' && !resetRequested) {
        const result = await apiClient.requestPasswordReset({ email: normalizedEmail });

        setResetRequested(true);

        if (result?.devResetToken) {
          setResetToken(result.devResetToken);
        }

        Alert.alert(
          'Reset instructions created',
          result?.devResetToken
            ? 'Development reset token has been filled in automatically.'
            : 'If an account exists, password reset instructions have been created.'
        );
        return;
      }

      if (mode === 'recover' && resetRequested) {
        const passwordMeetsRequirements =
          password.length >= 8 &&
          /[A-Za-z]/.test(password) &&
          /[0-9]/.test(password) &&
          /[^A-Za-z0-9]/.test(password);

        if (!resetToken.trim()) {
          Alert.alert('Reset token required', 'Enter the reset code from your recovery instructions.');
          return;
        }

        if (!passwordMeetsRequirements) {
          Alert.alert(
            'Password requirements not met',
            'Use at least 8 characters, including letters, numbers, and a special character.'
          );
          return;
        }

        if (password !== confirmPassword) {
          Alert.alert('Passwords do not match', 'Confirm your password and try again.');
          return;
        }

        const result = await apiClient.confirmPasswordReset({
          email: normalizedEmail,
          token: resetToken.trim(),
          newPassword: password,
        });

        if (!result?.ok) {
          Alert.alert('Recovery failed', result?.message || 'Unable to reset password.');
          return;
        }

        Alert.alert('Password reset', 'Your password has been reset. Please sign in.');
        setMode('login');
        setResetRequested(false);
        setResetToken('');
        resetSensitiveFields();
        return;
      }

      const result =
        mode === 'login'
          ? await apiClient.login({ email: normalizedEmail, password })
          : workspaceType === 'invite'
            ? await apiClient.acceptInvite({
                inviteToken: inviteToken.trim(),
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                password,
              })
            : await apiClient.register({
                email: normalizedEmail,
                password,
                tenantId:
                  workspaceType === 'company'
                    ? companyName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    : `individual-${normalizedEmail.replace(/[^a-z0-9]+/g, '-')}`,
                workspaceType,
                companyName: workspaceType === 'company' ? companyName.trim() : '',
                firstName: firstName.trim(),
                lastName: lastName.trim(),
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
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        fullName: `${firstName.trim()} ${lastName.trim()}`,
        companyName: companyName.trim(),
        workspaceType,
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

  if (true) return <>{children}</>;

  return (
    <ScrollView contentContainerStyle={[styles.wrap, { backgroundColor: colors.bg }]} keyboardShouldPersistTaps="handled">
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.authBrandBanner}>
          <Image source={logoHeader} style={styles.authBrandLogo} resizeMode="contain" />
        </View>

        <Text style={[styles.kicker, { color: colors.accent }]}>See Risk. Prevent Harm.</Text>

        <Text style={[styles.subtitle, { color: colors.sub }]}>
          {mode === 'login'
            ? 'Sign in to access inspections, reports, corrective actions, and protected local records.'
            : mode === 'recover'
              ? 'Enter your email to request a private password reset code.'
              : 'Create a personal account or company workspace for shared safety reports, corrective actions, and assignments.'}
        </Text>

        {mode === 'register' && (
          <>
            <View style={styles.accountTypeWrap}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Choose Account Type</Text>

              <View style={styles.accountTypeRow}>
                <TouchableOpacity
                  style={[
                    styles.accountTypeCard,
                    {
                      borderColor: workspaceType === 'individual' ? colors.accent : colors.border,
                      backgroundColor: workspaceType === 'individual' ? 'rgba(249,115,22,0.12)' : colors.cardAlt,
                    },
                  ]}
                  onPress={() => setWorkspaceType('individual')}
                >
                  <Text style={[styles.accountTypeTitle, { color: colors.text }]}>Individual</Text>
                  <Text style={[styles.accountTypeSub, { color: colors.sub }]}>Personal account for one user</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.accountTypeCard,
                    {
                      borderColor: workspaceType === 'company' ? colors.accent : colors.border,
                      backgroundColor: workspaceType === 'company' ? 'rgba(249,115,22,0.12)' : colors.cardAlt,
                    },
                  ]}
                  onPress={() => setWorkspaceType('company')}
                >
                  <Text style={[styles.accountTypeTitle, { color: colors.text }]}>Company</Text>
                  <Text style={[styles.accountTypeSub, { color: colors.sub }]}>Company workspace for up to 10 users</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.accountTypeCard,
                    {
                      borderColor: workspaceType === 'invite' ? colors.accent : colors.border,
                      backgroundColor: workspaceType === 'invite' ? 'rgba(249,115,22,0.12)' : colors.cardAlt,
                    },
                  ]}
                  onPress={() => setWorkspaceType('invite')}
                >
                  <Text style={[styles.accountTypeTitle, { color: colors.text }]}>Join Team</Text>
                  <Text style={[styles.accountTypeSub, { color: colors.sub }]}>Use an invite code</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TextInput
              style={[styles.input, { backgroundColor: colors.cardAlt, borderColor: colors.border, color: colors.text }]}
              placeholder="First Name"
              placeholderTextColor={colors.muted}
              value={firstName}
              onChangeText={setFirstName}
            />

            <TextInput
              style={[styles.input, { backgroundColor: colors.cardAlt, borderColor: colors.border, color: colors.text }]}
              placeholder="Last Name"
              placeholderTextColor={colors.muted}
              value={lastName}
              onChangeText={setLastName}
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

        {mode === 'register' && workspaceType === 'company' && (
          <TextInput
            style={[styles.input, { backgroundColor: colors.cardAlt, borderColor: colors.border, color: colors.text }]}
            placeholder="Company"
            placeholderTextColor={colors.muted}
            value={companyName}
            onChangeText={setCompanyName}
          />
        )}

        {mode === 'register' && workspaceType === 'invite' && (
          <TextInput
            style={[styles.input, { backgroundColor: colors.cardAlt, borderColor: colors.border, color: colors.text }]}
            placeholder="Invite Code"
            placeholderTextColor={colors.muted}
            value={inviteToken}
            onChangeText={setInviteToken}
          />
        )}

        {(mode === 'register' || (mode === 'recover' && resetRequested)) && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {mode === 'recover' ? 'Reset Password' : 'Create Password'}
            </Text>
            <Text style={[styles.passwordHelp, { color: colors.muted }]}>
              Use at least 8 characters with letters, numbers, and a special character.
            </Text>
          </>
        )}

        {mode === 'recover' && resetRequested && (
          <TextInput
            style={[
              styles.input,
              styles.resetCodeInput,
              { backgroundColor: colors.cardAlt, borderColor: colors.border, color: colors.text }
            ]}
            placeholder="Reset Code"
            placeholderTextColor={colors.muted}
            value={resetToken}
            onChangeText={setResetToken}
          />
        )}

        {(mode !== 'recover' || resetRequested) && (
          <TextInput
            style={[styles.input, { backgroundColor: colors.cardAlt, borderColor: colors.border, color: colors.text }]}
            placeholder="Password"
            placeholderTextColor={colors.muted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        )}

        {(mode === 'register' || mode === 'recover') && (
          <TextInput
            style={[styles.input, { backgroundColor: colors.cardAlt, borderColor: colors.border, color: colors.text }]}
            placeholder="Confirm Password"
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
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : mode === 'recover' ? (resetRequested ? 'Reset Password' : 'Request Reset Code') : workspaceType === 'invite' ? 'Join Workspace' : 'Create Workspace'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            resetSensitiveFields();
            setResetRequested(false);
            setResetToken('');
            setMode(mode === 'login' ? 'register' : 'login');
          }}
          style={styles.switchButton}
        >
          <Text style={[styles.switchText, { color: colors.accent }]}>
            {mode === 'login' ? 'Click ' : 'Already have an account? '}
            <Text style={styles.linkWord}>
              {mode === 'login' ? 'here' : 'Sign in'}
            </Text>
            {mode === 'login' ? ' to protect your workers' : ''}
          </Text>
        </TouchableOpacity>

        {mode === 'login' && (
          <TouchableOpacity
            onPress={() => {
              resetSensitiveFields();
              setResetRequested(false);
              setResetToken('');
              setMode('recover');
            }}
            style={styles.recoveryButton}
          >
            <Text style={[styles.recoveryText, { color: colors.muted }]}>
              Forgot your password?
            </Text>
          </TouchableOpacity>
        )}

        <Text style={[styles.securityNote, { color: colors.muted }]}>
          © 2026 Sentinel Safety • Monolith Studios. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  authBrandBanner: {
    backgroundColor: '#081827',
    marginHorizontal: -22,
    marginTop: -22,
    marginBottom: 20,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
  },
  authBrandLogo: {
    width: 520,
    height: 240,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrap: {
    flexGrow: 1,
    padding: 0,
  },
  card: {
    borderWidth: 1,
    borderRadius: 26,
    padding: 22,
    marginTop: 0,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  logo: {
    width: '100%',
    height: 170,
    maxWidth: 520,
    alignSelf: 'center',
    marginBottom: -35,
  },
  kicker: {
    fontSize: 24,
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
    marginBottom: 18,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 18,
  },
  accountTypeWrap: {
    width: '88%',
    alignSelf: 'center',
    marginBottom: 12,
  },
  accountTypeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  accountTypeCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    minHeight: 82,
  },
  accountTypeTitle: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 4,
  },
  accountTypeSub: {
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 15,
  },
  sectionTitle: {
    width: '88%',
    alignSelf: 'center',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 18,
    marginBottom: 4,
  },
  passwordHelp: {
    width: '88%',
    alignSelf: 'center',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 10,
  },
  resetCodeInput: {
    marginTop: 20,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    fontSize: 15,
    width: '88%',
    alignSelf: 'center',
    fontWeight: '700',
    marginBottom: 10,
  },
  button: {
    minHeight: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    width: '88%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    lineHeight: 15,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '900',
  },
  switchButton: {
    marginTop: 20,
    marginBottom: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchText: {
    fontSize: 13,
    fontWeight: '900',
  },
  linkWord: {
    textDecorationLine: 'underline',
    fontWeight: '900',
  },
  recoveryButton: {
    alignItems: 'center',
    marginTop: -28,
    marginBottom: 32,
  },
  recoveryText: {
    fontSize: 12,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  securityNote: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 15,
  },
});
