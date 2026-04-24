import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SecurityVault } from './SecurityVault';
import { useAppTheme } from '../theme/ThemeContext';

export default function AppLockGate({ children }: { children: React.ReactNode }) {
  const { colors } = useAppTheme();
  const [ready, setReady] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  useEffect(() => {
    SecurityVault.isConfigured().then((value) => {
      setConfigured(value);
      setReady(true);
    });
  }, []);

  const submit = async () => {
    if (pin.length < 4) {
      Alert.alert('PIN required', 'Enter at least 4 digits.');
      return;
    }

    if (!configured) {
      if (pin !== confirmPin) {
        Alert.alert('PINs do not match', 'Confirm your PIN and try again.');
        return;
      }

      await SecurityVault.setPin(pin);
      setConfigured(true);
      return;
    }

    const ok = await SecurityVault.unlock(pin);
    if (!ok) {
      Alert.alert('Incorrect PIN');
      setPin('');
    }
  };

  if (!ready) return null;

  if (!SecurityVault.isUnlocked()) {
    return (
      <View style={[styles.wrap, { backgroundColor: colors.bg }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {configured ? 'Unlock SafeScope' : 'Create Security PIN'}
        </Text>

        <Text style={[styles.sub, { color: colors.sub }]}>
          {configured
            ? 'Enter your PIN to access protected reports and local vault data.'
            : 'Create a PIN to protect reports saved on this device. Minimum 4 digits.'}
        </Text>

        <TextInput
          value={pin}
          onChangeText={setPin}
          secureTextEntry
          keyboardType="number-pad"
          placeholder={configured ? 'Enter PIN' : 'Create PIN'}
          placeholderTextColor={colors.muted}
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
        />

        {!configured && (
          <TextInput
            value={confirmPin}
            onChangeText={setConfirmPin}
            secureTextEntry
            keyboardType="number-pad"
            placeholder="Confirm PIN"
            placeholderTextColor={colors.muted}
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
          />
        )}

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent }]} onPress={submit}>
          <Text style={styles.buttonText}>{configured ? 'Unlock' : 'Create PIN'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '900', textAlign: 'center', marginBottom: 8 },
  sub: { fontSize: 14, fontWeight: '700', textAlign: 'center', lineHeight: 20, marginBottom: 22 },
  input: { minHeight: 52, borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, fontSize: 18, textAlign: 'center', marginBottom: 10 },
  button: { minHeight: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  buttonText: { color: '#fff', fontWeight: '900', fontSize: 15 },
});
