import AsyncStorage from '@react-native-async-storage/async-storage';
const AUTH_TOKEN_KEY = 'sentinel_safety_auth_token_v1';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://safescope-backend.onrender.com';

const getHeaders = () => {
  let token: string | null = null;

  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    token = localStorage.getItem('token');
  }

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const apiClient = {
  login: async (data: { email: string; password: string }) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  register: async (data: { email: string; password: string; tenantId?: string; workspaceType?: 'individual' | 'company'; companyName?: string; firstName?: string; lastName?: string }) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  requestPasswordReset: async (data: { email: string }) => {
    const res = await fetch(`${BASE_URL}/auth/password-reset/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  confirmPasswordReset: async (data: { email: string; token: string; newPassword: string }) => {
    const res = await fetch(`${BASE_URL}/auth/password-reset/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  createInvite: async (data: { email: string; role?: 'admin' | 'manager' | 'inspector' | 'viewer' }) => {
    const res = await fetch(`${BASE_URL}/auth/invite`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  acceptInvite: async (data: { inviteToken: string; firstName: string; lastName: string; password: string }) => {
    const res = await fetch(`${BASE_URL}/auth/invite/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getAuditLogs: async () => {
    const res = await fetch(`${BASE_URL}/audit`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  getCurrentUser: async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, { headers: getHeaders() });
    return res.json();
  },

  getDashboard: async () => {
    const res = await fetch(`${BASE_URL}/dashboard/overview`, { headers: getHeaders() });
    return res.json();
  },

  getReports: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    eventTypeCode?: string;
  }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res = await fetch(`${BASE_URL}/reports${query ? `?${query}` : ''}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  createReport: async (data: any) => {
    const res = await fetch(`${BASE_URL}/reports`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateReport: async (reportId: string, data: any) => {
    const res = await fetch(`${BASE_URL}/reports/${reportId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  addReportEvidence: async (reportId: string, attachments: Array<{ uri: string; mimeType?: string; fileName?: string }>) => {
    const res = await fetch(`${BASE_URL}/reports/${reportId}/evidence`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ attachments }),
    });
    return res.json();
  },

  getCorrectiveActions: async (params?: { page?: number; limit?: number; statusCode?: string; priorityCode?: string; assignedToMe?: boolean }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res = await fetch(`${BASE_URL}/actions${query ? `?${query}` : ''}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  updateCorrectiveActionStatus: async (
    actionId: string,
    data: { statusCode: 'open' | 'in_progress' | 'closed' | 'cancelled'; closureNotes?: string }
  ) => {
    const res = await fetch(`${BASE_URL}/actions/${actionId}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  closeCorrectiveAction: async (actionId: string, closureNotes: string) => {
    const res = await fetch(`${BASE_URL}/actions/${actionId}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ statusCode: 'closed', closureNotes }),
    });
    return res.json();
  },

  createCorrectiveAction: async (data: any) => {
    const res = await fetch(`${BASE_URL}/actions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  decideReview: async (reportId: string, data: { decision: 'approved' | 'rejected'; notes?: string }) => {
    const res = await fetch(`${BASE_URL}/reports/${reportId}/review-decision`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  archiveReport: async (reportId: string) => {
    const res = await fetch(`${BASE_URL}/reports/${reportId}/archive`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    return res.json();
  },

  deleteReport: async (reportId: string) => {
    const res = await fetch(`${BASE_URL}/reports/${reportId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },

  getReportDetail: async (reportId: string) => {
    const res = await fetch(`${BASE_URL}/reports/${reportId}`, { headers: getHeaders() });
    return res.json();
  },

  classifyReport: async (reportId: string) => {
    const res = await fetch(`${BASE_URL}/reports/${reportId}/classify`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return res.json();
  },

  getReportClassifications: async (reportId: string) => {
    const res = await fetch(`${BASE_URL}/reports/${reportId}/classifications`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  getTaxonomyRules: async () => {
    const res = await fetch(`${BASE_URL}/taxonomy/rules`, { headers: getHeaders() });
    return res.json();
  },

  getTaxonomySeverity: async () => {
    const res = await fetch(`${BASE_URL}/taxonomy/severity`, { headers: getHeaders() });
    return res.json();
  },

  getTaxonomyCategories: async () => {
    const res = await fetch(`${BASE_URL}/taxonomy/hazard-categories`, { headers: getHeaders() });
    return res.json();
  },

  createRule: async (data: any) => {
    const res = await fetch(`${BASE_URL}/taxonomy/rules`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateRule: async (id: string, data: any) => {
    const res = await fetch(`${BASE_URL}/taxonomy/rules/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  exportRules: async () => {
    const res = await fetch(`${BASE_URL}/taxonomy/rules/export`, { headers: getHeaders() });
    return res.text();
  },

importRules: async (csv: string) => {
    const res = await fetch(`${BASE_URL}/taxonomy/rules/import`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ csv }),
    });
    return res.json();
  },

  rollbackRule: async (ruleId: string, versionId: string) => {
    const res = await fetch(`${BASE_URL}/taxonomy/rules/${ruleId}/rollback/${versionId}`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return res.json();
  },

  getSessions: async () => {
    const res = await fetch(`${BASE_URL}/audit-sessions`, { headers: getHeaders() });
    return res.json();
  },

  createSession: async (data: any) => {
    const res = await fetch(`${BASE_URL}/audit-sessions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  addEntry: async (sessionId: string, data: any) => {
    const res = await fetch(`${BASE_URL}/audit-sessions/${sessionId}/entries`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  publishSession: async (sessionId: string) => {
    const res = await fetch(`${BASE_URL}/audit-sessions/${sessionId}/publish`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    return res.json();
  },
};
