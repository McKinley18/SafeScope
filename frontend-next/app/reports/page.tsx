"use client";

import { useEffect, useState } from "react";

export default function ReportsPage() {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("sentinel_latest_report");
    if (stored) {
      setReport(JSON.parse(stored));
    }
  }, []);

  return (
    <section>
      <div className="mb-5">
        <h1 className="text-3xl font-black text-slate-900">Inspection Report</h1>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Review finalized findings, standards, risk, and corrective actions.
        </p>
      </div>

      {!report ? (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="font-semibold text-slate-600">No inspection report has been generated yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-black text-slate-500">Report ID</p>
            <p className="mt-1 font-black text-slate-900">{report.id}</p>
            <p className="mt-3 text-sm font-black text-slate-500">Created</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">
              {new Date(report.createdAt).toLocaleString()}
            </p>
          </div>

          {report.findings?.map((finding: any, index: number) => (
            <div key={finding.id || index} className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-900">
                Finding {index + 1}: {finding.hazardCategory || "Uncategorized"}
              </h2>

              <p className="mt-3 text-sm font-black text-slate-500">Description</p>
              <p className="mt-1 text-slate-700">{finding.description || "No description provided."}</p>

              {!!finding.location && (
                <>
                  <p className="mt-3 text-sm font-black text-slate-500">Location</p>
                  <p className="mt-1 text-slate-700">{finding.location}</p>
                </>
              )}

              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <p className="font-black text-slate-900">SafeScope</p>
                <p className="mt-1 text-sm text-slate-700">
                  Classification: {finding.safeScopeResult?.classification || "Not run"}
                </p>
                <p className="text-sm text-slate-700">
                  Risk: {finding.safeScopeResult?.risk?.riskBand || finding.riskScore || "Not rated"}
                </p>
              </div>

              {!!finding.safeScopeResult?.suggestedStandards?.length && (
                <div className="mt-4">
                  <p className="font-black text-slate-900">Suggested Standards</p>
                  <div className="mt-2 space-y-2">
                    {finding.safeScopeResult.suggestedStandards.map((standard: any) => (
                      <div key={standard.citation} className="rounded-xl border border-slate-200 p-3">
                        <p className="font-black text-[#1D72B8]">{standard.citation}</p>
                        <p className="mt-1 text-sm text-slate-600">{standard.rationale}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!!finding.safeScopeResult?.generatedActions?.length && (
                <div className="mt-4">
                  <p className="font-black text-slate-900">Corrective Actions</p>
                  <div className="mt-2 space-y-2">
                    {finding.safeScopeResult.generatedActions.map((action: any, actionIndex: number) => (
                      <div key={actionIndex} className="rounded-xl border border-slate-200 p-3">
                        <p className="font-black text-slate-900">{action.title}</p>
                        <p className="mt-1 text-xs font-black text-red-700">{action.priority}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
