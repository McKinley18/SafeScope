import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BrandedHeader from '../../src/components/ui/BrandedHeader';
import { apiClient } from '../../src/api/client';
import { useAppTheme } from '../../src/theme/ThemeContext';
import { tokens } from '../../src/theme/tokens';

export default function TeamScreen() {
  const { colors } = useAppTheme();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'manager' | 'inspector' | 'viewer'>('inspector');
  const [inviteToken, setInviteToken] = useState('');

  const sendInvite = async () => {
    if (!email.trim()) {
      Alert.alert('Email required', 'Enter the team member email address.');
      return;
    }

    const result = await apiClient.createInvite({ email: email.trim().toLowerCase(), role });

    if (!result?.ok) {
      Alert.alert('Invite failed', result?.message || 'Unable to create invite.');
      return;
    }

    setInviteToken(result.inviteToken || '');
    Alert.alert('Invite created', 'Copy the invite code and send it to the team member.');
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}>
      <BrandedHeader
        title="Manage Team"
        subtitle="Invite users into the company workspace. Each user gets their own login and role."
      />

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Invite Team Member</Text>
        <Text style={[styles.helper, { color: colors.sub }]}>
          Company workspaces start with 10 seats. Additional seats can be added later in blocks of 10.
        </Text>

        <TextInput
          style={[styles.input, { backgroundColor: '#FFFFFF', borderColor: '#D7DEE8', color: '#101828' }]}
          placeholder="Team member email"
          placeholderTextColor="#667085"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={[styles.label, { color: colors.text }]}>Role</Text>

        <View style={styles.roles}>
          {(['admin', 'manager', 'inspector', 'viewer'] as const).map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.rolePill,
                {
                  borderColor: role === item ? colors.accent : colors.border,
                  backgroundColor: role === item ? 'rgba(249,115,22,0.14)' : colors.cardAlt,
                },
              ]}
              onPress={() => setRole(item)}
            >
              <Text style={[styles.roleText, { color: colors.text }]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={sendInvite}>
          <Ionicons name="mail-outline" size={18} color="#fff" />
          <Text style={styles.buttonText}>Create Invite</Text>
        </TouchableOpacity>

        {inviteToken ? (
          <View style={[styles.inviteBox, { borderColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.text }]}>Invite Code</Text>
            <Text selectable style={[styles.inviteToken, { color: colors.accent }]}>
              {inviteToken}
            </Text>
            <Text style={[styles.helper, { color: colors.sub }]}>
              Temporary dev flow: send this code to the user. Later this will become an email invite link.
            </Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.md,
    paddingBottom: 120,
    flexGrow: 1,
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 6,
  },
  helper: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
    marginBottom: 14,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  roles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  rolePill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'capitalize',
  },
  button: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
  },
  inviteBox: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  inviteToken: {
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 10,
  },
});
