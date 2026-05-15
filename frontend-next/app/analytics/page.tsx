"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { getReports } from "@/lib/reportStorage";
import { getStoredActions, type StoredAction } from "@/lib/actionStorage";

type AnalyticsReport = {
  id?: string;
  createdAt?: string;
  findings?: any[];
};

function ProgressRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs font-black text-slate-600">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-[#1D72B8]" style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [reports, setReports] = useState<AnalyticsReport[]>([]);
  const [actions, setActions] = useState<StoredAction[]>([]);

  useEffect(() => {
    async function loadAnalyticsData() {
      const savedReports = await getReports<AnalyticsReport>();
      const savedActions = await getStoredActions();

      setReports(Array.isArray(savedReports) ? savedReports : []);
      setActions(Array.isArray(savedActions) ? savedActions : []);
    }

    loadAnalyticsData();
  }, []);

  const analytics = useMemo(() => {
    const findings = reports.flatMap((report) => report.findings || []);
    const completedActions = actions.filter((action) => String(action.status).toLowerCase() === "completed");
    const openActions = actions.filter((action) => String(action.status).toLowerCase() !== "completed");

    const criticalFindings = findings.filter((finding) => {
      const riskScore = Number(finding.riskScore || finding.safeScopeResult?.risk?.riskScore || 0);
      const riskBand = String(finding.safeScopeResult?.risk?.riskBand || "").toLowerCase();
      return riskScore >= 20 || riskBand === "critical";
    });

    const closureRate = actions.length
      ? Math.round((completedActions.length / actions.length) * 100)
      : null;

    const riskThemes = findings.reduce<Record<string, number>>((acc, finding) => {
      const key =
        finding.hazardCategory ||
        finding.safeScopeResult?.classification ||
        "Uncategorized";

      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return {
      totalReports: reports.length,
      totalFindings: findings.length,
      criticalFindings: criticalFindings.length,
      openActions: openActions.length,
      closureRate,
      riskThemes: Object.entries(riskThemes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6),
    };
  }, [reports, actions]);

  const hasData = analytics.totalReports || analytics.totalFindings || actions.length;

  return (
    <section className="space-y-6">
      <PageHeader
        title="Insights"
        description="Workspace analytics generated from saved reports, findings, and corrective actions."
      />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          [String(analytics.totalReports), "Reports"],
          [String(analytics.totalFindings), "Findings"],
          [String(analytics.criticalFindings), "Critical Findings"],
          [analytics.closureRate === null ? "—" : `${analytics.closureRate}%`, "Closure Rate"],
        ].map(([value, label]) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-center">
            <p className="text-2xl font-black text-slate-900">{value}</p>
            <p className="mt-1 text-[10px] font-black uppercase tracking-wide text-slate-500">
              {label}
            </p>
          </div>
        ))}
      </section>

      {!hasData && (
        <section className="border-y border-slate-200 py-6">
          <p className="text-sm font-semibold leading-6 text-slate-600">
            Analytics will populate after inspections, reports, and corrective actions are created.
          </p>
        </section>
      )}

      <section className="grid gap-8 border-t border-slate-200 pt-6 lg:grid-cols-2">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#1D72B8]">
            Risk Themes
          </p>
          <h2 className="mt-2 text-xl font-black text-slate-900">
            Finding concentration
          </h2>

          <div className="mt-5 space-y-4">
            {analytics.riskThemes.length ? (
              analytics.riskThemes.map(([label, value]) => (
                <ProgressRow key={label} label={label} value={value} />
              ))
            ) : (
              <p className="text-sm font-semibold text-slate-500">
                No finding themes available yet.
              </p>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#1D72B8]">
            Corrective Action Health
          </p>
          <h2 className="mt-2 text-xl font-black text-slate-900">
            Closure and workload
          </h2>

          <div className="mt-5 border-y border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 py-3">
              <p className="text-sm font-black text-slate-900">Open Actions</p>
              <p className="text-sm font-black text-slate-700">{analytics.openActions}</p>
            </div>
            <div className="flex items-center justify-between py-3">
              <p className="text-sm font-black text-slate-900">Closure Rate</p>
              <p className="text-sm font-black text-slate-700">
                {analytics.closureRate === null ? "No actions yet" : `${analytics.closureRate}%`}
              </p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
