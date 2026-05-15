import AsyncStorage from '@react-native-async-storage/async-storage';
import { VaultEntry } from '../types';

const VAULT_KEYS = {
  ENTRIES: '@mybio_vault_entries',
  MASTER_HASH: '@mybio_vault_master_hash',
  UNLOCK_STATE: '@mybio_vault_unlock_state',
};

class VaultService {
  private isUnlocked: boolean = false;
  private unlockTimestamp: number = 0;
  private autoLockMinutes: number = 3;

  async isMasterPasswordSet(): Promise<boolean> {
    const hash = await AsyncStorage.getItem(VAULT_KEYS.MASTER_HASH);
    return hash !== null;
  }

  async setMasterPassword(password: string): Promise<void> {
    const CryptoJS = require('crypto-js');
    const hash = CryptoJS.PBKDF2(password, 'mybio-salt', { keySize: 256 / 32, iterations: 10000 }).toString();
    await AsyncStorage.setItem(VAULT_KEYS.MASTER_HASH, hash);
  }

  async verifyMasterPassword(password: string): Promise<boolean> {
    const storedHash = await AsyncStorage.getItem(VAULT_KEYS.MASTER_HASH);
    if (!storedHash) return false;
    const CryptoJS = require('crypto-js');
    const hash = CryptoJS.PBKDF2(password, 'mybio-salt', { keySize: 256 / 32, iterations: 10000 }).toString();
    return hash === storedHash;
  }

  async unlock(autoLockMinutes: number = 3): Promise<void> {
    this.isUnlocked = true;
    this.unlockTimestamp = Date.now();
    this.autoLockMinutes = autoLockMinutes;
    await AsyncStorage.setItem(VAULT_KEYS.UNLOCK_STATE, JSON.stringify({ isUnlocked: true, unlockedAt: this.unlockTimestamp, autoLockMinutes }));
  }

  async lock(): Promise<void> {
    this.isUnlocked = false;
    this.unlockTimestamp = 0;
    await AsyncStorage.removeItem(VAULT_KEYS.UNLOCK_STATE);
  }

  async getUnlockState(): Promise<{ isUnlocked: boolean; unlockedAt: number | null }> {
    const stateStr = await AsyncStorage.getItem(VAULT_KEYS.UNLOCK_STATE);
    if (!stateStr) return { isUnlocked: false, unlockedAt: null };
    return JSON.parse(stateStr);
  }

  async getEntries(): Promise<VaultEntry[]> {
    const data = await AsyncStorage.getItem(VAULT_KEYS.ENTRIES);
    if (!data) return [];
    try {
      const CryptoJS = require('crypto-js');
      const masterHash = await AsyncStorage.getItem(VAULT_KEYS.MASTER_HASH);
      const decrypted = CryptoJS.AES.decrypt(data, masterHash!).toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch { return []; }
  }

  async saveEntries(entries: VaultEntry[]): Promise<void> {
    const CryptoJS = require('crypto-js');
    const masterHash = await AsyncStorage.getItem(VAULT_KEYS.MASTER_HASH);
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(entries), masterHash!).toString();
    await AsyncStorage.setItem(VAULT_KEYS.ENTRIES, encrypted);
  }

  async addEntry(entry: VaultEntry): Promise<void> {
    const entries = await this.getEntries();
    entries.push(entry);
    await this.saveEntries(entries);
  }

  async updateEntry(entryId: string, updates: Partial<VaultEntry>): Promise<void> {
    const entries = await this.getEntries();
    const index = entries.findIndex(e => e.id === entryId);
    if (index !== -1) {
      entries[index] = { ...entries[index], ...updates, updatedAt: new Date().toISOString() };
      await this.saveEntries(entries);
    }
  }

  async deleteEntry(entryId: string): Promise<void> {
    const entries = await this.getEntries();
    await this.saveEntries(entries.filter(e => e.id !== entryId));
  }

  generatePassword(length: number = 16): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const all = uppercase + lowercase + numbers + symbols;
    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    for (let i = password.length; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  analyzePasswordStrength(password: string): { strength: 'weak' | 'medium' | 'strong'; score: number; feedback: string[] } {
    const feedback: string[] = [];
    let score = 0;
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) score += 10;
    if (/[0-9]/.test(password)) score += 10;
    if (/[^a-zA-Z0-9]/.test(password)) score += 10;
    if (/(.)\1{2,}/.test(password)) { score -= 10; feedback.push('Tekrar eden karakterler var'); }
    if (/^[a-zA-Z]+$/.test(password)) feedback.push('Sayı ve sembol ekleyin');
    if (password.length < 8) feedback.push('En az 8 karakter olmalı');
    const strength = score >= 70 ? 'strong' : score >= 40 ? 'medium' : 'weak';
    return { strength, score, feedback };
  }
}

export const vaultService = new VaultService();
