import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';

const CONFIG_KEY = 'safescope_security_config_v1';

let sessionKey: string | null = null;

const randomSalt = () => `${Date.now()}_${Math.random().toString(36).slice(2)}`;

const hashPin = (pin: string, salt: string) =>
  CryptoJS.SHA256(`${salt}:${pin}:safescope`).toString();

const deriveKey = (pin: string, salt: string) =>
  CryptoJS.SHA256(`${pin}:${salt}:local_vault_key`).toString();

export const SecurityVault = {
  async isConfigured() {
    return !!(await AsyncStorage.getItem(CONFIG_KEY));
  },

  async setPin(pin: string) {
    const salt = randomSalt();
    const pinHash = hashPin(pin, salt);
    sessionKey = deriveKey(pin, salt);
    await AsyncStorage.setItem(CONFIG_KEY, JSON.stringify({ salt, pinHash }));
  },

  async unlock(pin: string) {
    const raw = await AsyncStorage.getItem(CONFIG_KEY);
    if (!raw) return false;

    const config = JSON.parse(raw);
    const check = hashPin(pin, config.salt);

    if (check !== config.pinHash) return false;

    sessionKey = deriveKey(pin, config.salt);
    return true;
  },

  lock() {
    sessionKey = null;
  },

  isUnlocked() {
    return !!sessionKey;
  },

  encrypt(value: string) {
    if (!sessionKey) return value;
    return CryptoJS.AES.encrypt(value, sessionKey).toString();
  },

  decrypt(value: string) {
    if (!sessionKey) return value;
    const bytes = CryptoJS.AES.decrypt(value, sessionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  },
};
