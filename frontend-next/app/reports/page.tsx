"use client";

import { secureStorage } from "@/lib/secureStorage";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import AnnotationPreview from "@/components/evidence/AnnotationPreview";
import { localExporter } from "@/lib/localExporter";

type Report = {
  id: string;
  createdAt: string;
  title?: string;
  location?: string;
  findings?: any[];
  storageSource?: "local" | "cloud" | "seed";
};

const SEEDED_REPORTS: Report[] = [
  {
    id: "RPT-2026-001",
    title: "Conveyor Guarding Inspection",
    location: "Plant 3",
    createdAt: "2026-05-12T09:00:00.000Z",
    findings: [{ hazardCategory: "Machine Guarding", riskScore: 16 }],
  },
  {
    id: "RPT-2026-002",
    title: "Electrical Safety Audit",
    location: "Substation A",
    createdAt: "2026-05-10T09:00:00.000Z",
    findings: [{ hazardCategory: "Electrical", riskScore: 25 }],
  },
];

function getRiskLabel(report: Report) {
  const scores = report.findings?.map((f) => Number(f.riskScore || 0)) || [];
  const max = Math.max(0, ...scores);

  if (max >= 20) return "Critical";
  if (max >= 12) return "High";
  if (max >= 6) return "Moderate";
  return "Low";
}

function riskClasses(risk: string) {
  switch (risk) {
    case "Critical":
      return "bg-red-100 text-red-700";
    case "High":
      return "bg-orange-100 text-orange-700";
    case "Moderate":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editLocation, setEditLocation] = useState("");

  useEffect(() => {
    async function loadReports() {
      const parsedReports: Report[] = secureStorage.get("reports", [] as Report[]);

      const localReports = parsedReports.map((report) => ({
        ...report,
        storageSource: report.storageSource || "local",
      }));

      const latest = secureStorage.get("latest_report", null as any);
      const latestReport: Report | null = latest ? JSON.parse(latest) : null;

      const merged: Report[] = [...localReports];

      if (latestReport && !merged.some((report) => report.id === latestReport.id)) {
        merged.unshift({
          ...latestReport,
          storageSource: latestReport.storageSource || "local",
          title: latestReport.title || "Inspection Report",
          location:
            latestReport.location ||
            latestReport.findings?.[0]?.location ||
            "Field Inspection",
        });
      }


    }

    loadReports();
  }, []);

  const sortedReports = useMemo(() => {
    return [...reports].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [reports]);

  function persist(nextReports: Report[]) {
    setReports(nextReports);
    secureStorage.set("reports", JSON.stringify(nextReports));
  }

  function startEdit(report: Report) {
    secureStorage.set("edit_report", JSON.stringify(report));
    router.push("/inspection-review");
  }

  function saveEdit(reportId: string) {
    const nextReports = reports.map((report) =>
      report.id === reportId
        ? {
            ...report,
            title: editTitle.trim() || "Inspection Report",
            location: editLocation.trim() || "Field Inspection",
          }
        : report
    );

    persist(nextReports);
    setEditingReportId(null);
    setEditTitle("");
    setEditLocation("");
  }

  function deleteReport(reportId: string) {
    const confirmed = window.confirm("Delete this report? This cannot be undone.");
    if (!confirmed) return;

    const nextReports = reports.filter((report) => report.id !== reportId);
    persist(nextReports);

    const latest = secureStorage.get("latest_report", null as any);
    if (latest) {
      const latestReport = latest;
      if (latestReport.id === reportId) {
        secureStorage.remove("latest_report");
      }
    }
  }

  async function exportReport(report: Report) {
    const coverPage = secureStorage.get("cover_page", {} as any);

    const normalizedFindings = (report.findings || []).map((finding: any) => ({
      category:
        finding.hazardCategory ||
        finding.category ||
        finding.safeScopeResult?.classification ||
        "Uncategorized",
      description:
        finding.description ||
        finding.hazard ||
        finding.observedCondition ||
        "No description provided.",
      location: finding.location || report.location || "Field Inspection",
      severity: Number(finding.severity || finding.severityScore || 1),
      likelihood: Number(finding.likelihood || finding.likelihoodScore || 1),
      standards:
        finding.standards ||
        finding.safeScopeResult?.suggestedStandards ||
        finding.safeScopeResult?.standards ||
        [],
      correctiveActions:
        finding.correctiveActions ||
        finding.safeScopeResult?.generatedActions ||
        [],
      photos: finding.photos || [],
      safeScopeResult: finding.safeScopeResult || null,
    }));

    await localExporter.generatePDF({
      adminInfo: {
        company:
          coverPage.organizationName ||
          coverPage.company ||
          (report as any).company ||
          "Organization Name",
        site:
          coverPage.siteLocation ||
          coverPage.site ||
          report.location ||
          "Field Inspection",
        inspector:
          coverPage.leadInspector ||
          coverPage.inspector ||
          (report as any).inspector ||
          "Inspector",
        date:
          coverPage.inspectionDate ||
          new Date(report.createdAt).toLocaleDateString(),
        isConfidential:
          Boolean(coverPage.isConfidential || (report as any).confidential),
      },
      findings: normalizedFindings,
    });
  }

  return (
    <section className="space-y-5">
      <PageHeader
        title="Reports"
        description="Inspection reports, findings, evidence, and operational risk summaries."
      />


      {sortedReports.length === 0 ? (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="font-semibold text-slate-600">No reports available.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedReports.map((report) => {
            const risk = getRiskLabel(report);
            const firstPhoto = report.findings?.flatMap((f) => f.photos || [])?.[0];

            return (
              <div key={report.id} className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex min-w-0 flex-1 gap-4">
                    {firstPhoto && (
                      <div className="hidden w-28 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 sm:block">
                        <AnnotationPreview
                          photoUrl={firstPhoto.url}
                          annotations={firstPhoto.annotations || []}
                        />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      {editingReportId === report.id ? (
                        <div className="space-y-3">
                          <input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold outline-none focus:border-[#1D72B8]"
                            placeholder="Report title"
                          />

                          <input
                            value={editLocation}
                            onChange={(e) => setEditLocation(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold outline-none focus:border-[#1D72B8]"
                            placeholder="Location"
                          />
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-wrap items-center gap-3">
                            <h2 className="text-xl font-black text-slate-900">
                              {report.title || "Inspection Report"}
                            </h2>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-black ${riskClasses(
                                risk
                              )}`}
                            >
                              {risk}
                            </span>

                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                              {report.storageSource === "cloud"
                                ? "Workspace Database"
                                : report.storageSource === "seed"
                                  ? "Sample"
                                  : "Local"}
                            </span>
                          </div>

                          <p className="mt-2 text-sm font-semibold text-slate-500">
                            {report.id} • {report.location || "Field Inspection"}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-3 text-xs font-black text-slate-500">
                            <span>{report.findings?.length || 0} Findings</span>
                            <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {editingReportId === report.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(report.id)}
                          className="rounded-xl bg-[#1D72B8] px-4 py-2 text-sm font-black text-white"
                        >
                          Save
                        </button>

                        <button
                          onClick={() => setEditingReportId(null)}
                          className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(report)}
                          className="rounded-xl bg-[#E8F4FF] px-4 py-2 text-sm font-black text-[#1D72B8]"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => exportReport(report)}
                          className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700"
                        >
                          Export
                        </button>

                        <button
                          onClick={() => deleteReport(report.id)}
                          className="rounded-xl bg-red-50 px-4 py-2 text-sm font-black text-red-700"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
