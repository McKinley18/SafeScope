const BASE_URL = 'http://localhost:3000';

export const apiClient = {
  getDashboard: async () => {
    const BASE_URL = 'http://localhost:3000';

    const getHeaders = () => {
      const token = localStorage.getItem('token');
      return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
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

    export const apiClient = {
      login: async (email: string, password: string) => {
        const res = await fetch(`${BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
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
      getReports: async (params?: { page?: number, limit?: number, status?: string, eventTypeCode?: string }) => {
        const query = new URLSearchParams(params as any).toString();
        const res = await fetch(`${BASE_URL}/reports?${query}`, { headers: getHeaders() });
        return res.json();
      },      createReport: async (data: any) => {
        const res = await fetch(`${BASE_URL}/reports`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(data),
        });
        return res.json();
      },
      classifyReport: async (reportId: string) => {
        const res = await fetch(`${BASE_URL}/reports/${reportId}/classify`, { method: 'POST', headers: getHeaders() });
        return res.json();
      },
      getReportDetail: async (reportId: string) => {
        const res = await fetch(`${BASE_URL}/reports/${reportId}`, { headers: getHeaders() });
        return res.json();
      },
      getReportAudit: async (reportId: string) => {
        const res = await fetch(`${BASE_URL}/reports/${reportId}/audit`, { headers: getHeaders() });
        return res.json();
      },
      exportReport: async (reportId: string) => {
        const res = await fetch(`${BASE_URL}/reports/${reportId}/export`, { headers: getHeaders() });
        return res.json();
      },
      getReportClassifications: async (reportId: string) => {        const res = await fetch(`${BASE_URL}/reports/${reportId}/classifications`, { headers: getHeaders() });
        return res.json();
      },
      getReviewQueue: async () => {
        const res = await fetch(`${BASE_URL}/review-queue`, { headers: getHeaders() });
        return res.json();
      },
      reviewClassification: async (classificationId: string, action: string, notes: string) => {
        const res = await fetch(`${BASE_URL}/classifications/${classificationId}/review`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ action, notes }),
        });
        return res.json();
      },
      getActions: async () => {
        const res = await fetch(`${BASE_URL}/actions`, { headers: getHeaders() });
        return res.json();
      },
      createAction: async (data: any) => {
        const res = await fetch(`${BASE_URL}/actions`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(data),
        });
        return res.json();
      },
      closeAction: async (actionId: string, closureNotes: string) => {
        const res = await fetch(`${BASE_URL}/actions/${actionId}/close`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ closureNotes }),
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

