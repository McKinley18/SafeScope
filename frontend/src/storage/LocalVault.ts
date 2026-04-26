import AsyncStorage from '@react-native-async-storage/async-storage';
import { SecurityVault } from '../security/SecurityVault';

const VAULT_VERSION = 'v1';
const VAULT_PREFIX = `sentinel_safety_local_vault_${VAULT_VERSION}`;

export type LocalVaultReportStatus =
  | 'draft'
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'closed';

export type LocalVaultEvidence = {
  id: string;
  uri: string;
  fileName?: string;
  mimeType?: string;
  createdAt: string;
};

export type LocalVaultReport = {
  id: string;
  title?: string;
  hazardDescription?: string;
  narrative?: string;
  area?: string;
  equipment?: string;
  workActivity?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical' | string;
  immediateDanger?: boolean;
  notes?: string;
  reportStatus: LocalVaultReportStatus;
  evidence: LocalVaultEvidence[];
  backendReportId?: string;
  syncStatus: 'local_only' | 'pending_sync' | 'synced' | 'sync_failed';
  createdAt: string;
  updatedAt: string;
};

const key = (name: string) => `${VAULT_PREFIX}:${name}`;

const REPORTS_KEY = key('reports');

const readJson = async <T>(storageKey: string, fallback: T): Promise<T> => {
  try {
    const encrypted = await AsyncStorage.getItem(`${storageKey}:encrypted`);

    if (encrypted && SecurityVault.isUnlocked()) {
      const decrypted = SecurityVault.decrypt(encrypted);
      return decrypted ? JSON.parse(decrypted) : fallback;
    }

    const raw = await AsyncStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = async <T>(storageKey: string, value: T) => {
  const raw = JSON.stringify(value);

  if (SecurityVault.isUnlocked()) {
    await AsyncStorage.setItem(`${storageKey}:encrypted`, SecurityVault.encrypt(raw));
    await AsyncStorage.removeItem(storageKey);
    return;
  }

  await AsyncStorage.setItem(storageKey, raw);
};

const createId = () => {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

export const LocalVault = {
  createId,

  async getReports(): Promise<LocalVaultReport[]> {
    return readJson<LocalVaultReport[]>(REPORTS_KEY, []);
  },

  async getReport(id: string): Promise<LocalVaultReport | null> {
    const reports = await this.getReports();
    return reports.find((report) => report.id === id) || null;
  },

  async saveReport(input: Partial<LocalVaultReport>): Promise<LocalVaultReport> {
    const reports = await this.getReports();
    const now = new Date().toISOString();

    const existing = input.id
      ? reports.find((report) => report.id === input.id)
      : undefined;

    const next: LocalVaultReport = {
      id: input.id || createId(),
      title: input.title,
      hazardDescription: input.hazardDescription,
      narrative: input.narrative,
      area: input.area,
      equipment: input.equipment,
      workActivity: input.workActivity,
      severity: input.severity || 'medium',
      immediateDanger: input.immediateDanger || false,
      notes: input.notes,
      reportStatus: input.reportStatus || existing?.reportStatus || 'draft',
      evidence: input.evidence || existing?.evidence || [],
      backendReportId: input.backendReportId || existing?.backendReportId,
      syncStatus: input.syncStatus || existing?.syncStatus || 'local_only',
      createdAt: existing?.createdAt || input.createdAt || now,
      updatedAt: now,
    };

    const updated = existing
      ? reports.map((report) => (report.id === next.id ? next : report))
      : [next, ...reports];

    await writeJson(REPORTS_KEY, updated);
    return next;
  },

  async deleteReport(id: string): Promise<void> {
    const reports = await this.getReports();
    await writeJson(
      REPORTS_KEY,
      reports.filter((report) => report.id !== id)
    );
  },

  async clearReports(): Promise<void> {
    await AsyncStorage.removeItem(REPORTS_KEY);
  },

  async addEvidence(reportId: string, evidence: Omit<LocalVaultEvidence, 'id' | 'createdAt'>[]) {
    const report = await this.getReport(reportId);
    if (!report) return null;

    const now = new Date().toISOString();

    const nextEvidence = evidence.map((item) => ({
      id: createId(),
      createdAt: now,
      ...item,
    }));

    return this.saveReport({
      ...report,
      evidence: [...report.evidence, ...nextEvidence],
      syncStatus: report.syncStatus === 'synced' ? 'pending_sync' : report.syncStatus,
    });
  },

  async markSubmitted(id: string, backendReportId?: string) {
    const report = await this.getReport(id);
    if (!report) return null;

    return this.saveReport({
      ...report,
      backendReportId: backendReportId || report.backendReportId,
      reportStatus: 'submitted',
      syncStatus: backendReportId ? 'synced' : 'pending_sync',
    });
  },

  async getPreferences<T>(name: string, fallback: T): Promise<T> {
    return readJson<T>(key(`preferences:${name}`), fallback);
  },

  async setPreferences<T>(name: string, value: T): Promise<void> {
    await writeJson(key(`preferences:${name}`), value);
  },
};
