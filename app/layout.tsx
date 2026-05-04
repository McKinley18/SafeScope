'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

persistQueryClient({
  queryClient,
  persister: asyncStoragePersister,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', background: '#0b1220', color: '#e5e7eb' }}>
        <QueryClientProvider client={queryClient}>
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>
            <aside style={{ borderRight: '1px solid #1f2937', padding: 20 }}>
              <h2>Sentinel Platform</h2>
              <nav style={{ display: 'grid', gap: 12 }}>
                <a href="/dashboard" style={{ color: '#cbd5e1' }}>Dashboard</a>
                <a href="/reports/new" style={{ color: '#cbd5e1' }}>New Report</a>
                <a href="/reports/review-queue" style={{ color: '#cbd5e1' }}>Review Queue</a>
                <a href="/actions" style={{ color: '#cbd5e1' }}>Actions</a>
                <a href="/audit" style={{ color: '#cbd5e1' }}>Audit Workspace</a>
              </nav>
            </aside>
            <main style={{ padding: 24 }}>{children}</main>
          </div>
        </QueryClientProvider>
      </body>
    </html>
  );
}
