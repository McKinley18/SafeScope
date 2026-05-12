import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'sentinel-secure-storage';
const STORE_NAME = 'inspections';
const SECRET_KEY_ALIAS = 'sentinel-crypto-key';

class SecureStorage {
  private db: Promise<IDBPDatabase> | null = null;

  private getDB(): Promise<IDBPDatabase> {
    if (typeof window === 'undefined') {
      throw new Error('SecureStorage can only be used in the browser');
    }
    
    if (!this.db) {
      this.db = openDB(DB_NAME, 1, {
        upgrade(db) {
          db.createObjectStore(STORE_NAME);
        },
      });
    }
    return this.db;
  }

  // 🔷 GET OR CREATE ENCRYPTION KEY
  private async getEncryptionKey(): Promise<CryptoKey> {
    if (typeof window === 'undefined') throw new Error('Not supported in SSR');

    const existingKey = localStorage.getItem(SECRET_KEY_ALIAS);
    if (existingKey) {
      const keyBuffer = Uint8Array.from(atob(existingKey), c => c.charCodeAt(0));
      return await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        'AES-GCM',
        true,
        ['encrypt', 'decrypt']
      );
    }

    // Generate new key if none exists
    const newKey = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    const exported = await crypto.subtle.exportKey('raw', newKey);
    localStorage.setItem(SECRET_KEY_ALIAS, btoa(String.fromCharCode(...new Uint8Array(exported))));
    return newKey;
  }

  // 🔷 ENCRYPT DATA
  async encrypt(data: any): Promise<{ iv: string, ciphertext: string }> {
    const key = await this.getEncryptionKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(JSON.stringify(data));
    
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );

    return {
      iv: btoa(String.fromCharCode(...iv)),
      ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertext)))
    };
  }

  // 🔷 DECRYPT DATA
  async decrypt(encrypted: { iv: string, ciphertext: string }): Promise<any> {
    const key = await this.getEncryptionKey();
    const iv = Uint8Array.from(atob(encrypted.iv), c => c.charCodeAt(0));
    const ciphertext = Uint8Array.from(atob(encrypted.ciphertext), c => c.charCodeAt(0));

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    return JSON.parse(new TextDecoder().decode(decrypted));
  }

  // 🔷 PUBLIC METHODS
  async saveInspection(id: string, data: any) {
    if (typeof window === 'undefined') return;
    const encrypted = await this.encrypt(data);
    const db = await this.getDB();
    await db.put(STORE_NAME, encrypted, id);
  }

  async getInspection(id: string): Promise<any> {
    if (typeof window === 'undefined') return null;
    const db = await this.getDB();
    const encrypted = await db.get(STORE_NAME, id);
    if (!encrypted) return null;
    return await this.decrypt(encrypted);
  }
}

export const secureStorage = new SecureStorage();
