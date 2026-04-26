import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../src/theme/ThemeContext';
import { tokens } from '../../src/theme/tokens';
import AppFooter from '../../src/components/ui/AppFooter';
import BrandedHeader from '../../src/components/ui/BrandedHeader';
import { LocalVault } from '../../src/storage/LocalVault';
import { SecurityVault } from '../../src/security/SecurityVault';

const AUTH_TOKEN_KEY = 'safescope_auth_token_v1';
const AUTH_USER_KEY = 'safescope_auth_user_v1';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, themeMode, setThemeMode } = useAppTheme();

  const [localDraftCount, setLocalDraftCount] = useState(0);
  const [user, setUser] = useState<any>({});
  const [highVisibility, setHighVisibility] = useState(false);

  useEffect(() => {
    const load = async () => {
      const rows = await LocalVault.getReports();
      const rawUser = await AsyncStorage.getItem(AUTH_USER_KEY);

      setLocalDraftCount(rows.length);
      setUser(rawUser ? JSON.parse(rawUser) : {});
    };

    load();
  }, []);

  const logout = async () => {
    Alert.alert('Sign out?', 'You will need to sign in again to access this workspace.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
          await AsyncStorage.removeItem(AUTH_USER_KEY);
          window.location.reload();
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}>
      <BrandedHeader
        title="Control Center"
        subtitle="Manage workspace access, security, local records, and preferences."
      />

      <View style={[styles.profileBand, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
        <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
          <Text style={styles.avatarText}>{(user?.email || 'S').slice(0, 1).toUpperCase()}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[styles.profileTitle, { color: colors.text }]}>
            {user?.companyName || user?.tenantId || 'Sentinel Safety Workspace'}
          </Text>
          <Text style={[styles.profileSub, { color: colors.sub }]}>
            {user?.email || 'Signed in user'} • {user?.role || 'owner'}
          </Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Security</Text>

      <View style={styles.list}>
        <TouchableOpacity style={[styles.row, { borderBottomColor: colors.border }]} onPress={() => SecurityVault.lock()}>
          <Ionicons name="lock-closed-outline" size={22} color={colors.accent} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>Lock Local Vault</Text>
            <Text style={[styles.rowSub, { color: colors.sub }]}>Protect device-saved reports and drafts.</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={18} color={colors.muted} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.row, { borderBottomColor: colors.border }]} onPress={() => router.push('/tabs/vault' as any)}>
          <Ionicons name="file-tray-full-outline" size={22} color={colors.accent} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>Local Vault</Text>
            <Text style={[styles.rowSub, { color: colors.sub }]}>{localDraftCount} saved local drafts on this device.</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={18} color={colors.muted} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>

      <View style={styles.list}>
        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <Ionicons name="moon-outline" size={22} color={colors.accent} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>Dark Mode</Text>
            <Text style={[styles.rowSub, { color: colors.sub }]}>Switch between light and dark workspace themes.</Text>
          </View>
          <Switch value={themeMode === 'dark'} onValueChange={(value) => setThemeMode(value ? 'dark' : 'light')} />
        </View>

        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <Ionicons name="contrast-outline" size={22} color={colors.accent} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>High Visibility</Text>
            <Text style={[styles.rowSub, { color: colors.sub }]}>Larger contrast mode for field environments.</Text>
          </View>
          <Switch value={highVisibility} onValueChange={setHighVisibility} />
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Workspace</Text>

      <View style={styles.list}>
        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <Ionicons name="business-outline" size={22} color={colors.accent} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>Tenant</Text>
            <Text style={[styles.rowSub, { color: colors.sub }]}>{user?.tenantId || 'default'}</Text>
          </View>
        </View>

        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <Ionicons name="shield-checkmark-outline" size={22} color={colors.accent} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>Role</Text>
            <Text style={[styles.rowSub, { color: colors.sub }]}>{user?.role || 'owner'}</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.row, { borderBottomColor: colors.border }]} onPress={logout}>
          <Ionicons name="log-out-outline" size={22} color="#ef4444" />
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: '#ef4444' }]}>Sign Out</Text>
            <Text style={[styles.rowSub, { color: colors.sub }]}>End this workspace session.</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={[styles.versionText, { color: colors.muted }]}>
        Sentinel Safety Platform
      </Text>

      <AppFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.md,
    paddingBottom: 120,
    flexGrow: 1,
  },
  screenHeader: {
    paddingTop: 4,
    paddingBottom: 120,
  },
  headerKicker: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  headerSub: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  profileBand: {
    borderWidth: 1,
    borderRadius: 18,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
  },
  profileTitle: {
    fontSize: 17,
    fontWeight: '900',
  },
  profileSub: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 6,
    marginTop: 8,
  },
  list: {
    marginBottom: tokens.spacing.xl,
  },
  row: {
    minHeight: 72,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  rowSub: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 6,
    marginBottom: 12,
  },
});
