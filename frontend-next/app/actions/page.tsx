"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { getReports } from "@/lib/reportStorage";
import { createActionId, getStoredActions, saveStoredActions } from "@/lib/actionStorage";

type ActionItem = {
  id: string;
  title: string;
  priority: string;
  status: string;
  due?: string;
  source: string;
  location?: string;
  findingTitle?: string;
  createdAt: string;
};

type Report = {
  id?: string;
  createdAt?: string;
  findings?: any[];
};

export default function ActionsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [manualActions, setManualActions] = useState<ActionItem[]>([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [due, setDue] = useState("");

  useEffect(() => {
    async function loadActions() {
      const savedReports = await getReports<Report>();
      setReports(Array.isArray(savedReports) ? savedReports : []);

      const savedManualActions = await getStoredActions();
      setManualActions(savedManualActions);
    }

    loadActions();
  }, []);

  const reportActions = useMemo(() => {
    return reports.flatMap((report) =>
      (report.findings || []).flatMap((finding) =>
        [
          ...(finding.manualActions || []),
          ...(finding.correctiveActions || []),
          ...(finding.safeScopeResult?.generatedActions || []),
        ].map((action: any, actionIndex: number) => ({
          id: action.id || `${report.id || "report"}-${finding.id || finding.hazardCategory || "finding"}-${actionIndex}`,
          title: action.title || action.description || "Corrective action",
          priority: action.priority || "Medium",
          status: action.status || "Open",
          due: action.dueDate || action.due || "",
          source: action.source || (action.generatedBy === "SafeScope" ? "SafeScope" : "User"),
          location: finding.location || "Field Inspection",
          findingTitle:
            finding.hazardCategory ||
            finding.safeScopeResult?.classification ||
            finding.description ||
            "Inspection Finding",
          createdAt: report.createdAt || new Date().toISOString(),
        }))
      )
    );
  }, [reports]);

  const actions = [...manualActions, ...reportActions];

  function updateManualActionStatus(index: number, status: string) {
    const nextActions = manualActions.map((action, actionIndex) =>
      actionIndex === index ? { ...action, status } : action
    );

    setManualActions(nextActions);
    saveStoredActions(nextActions);
  }

  function addAction() {
    if (!title.trim()) return;

    const nextAction: ActionItem = {
      id: createActionId(),
      title: title.trim(),
      priority,
      status: "Open",
      due,
      source: "User",
      createdAt: new Date().toISOString(),
    } as any;

    const nextActions = [nextAction, ...manualActions];
    setManualActions(nextActions);
    saveStoredActions(nextActions);

    setTitle("");
    setPriority("Medium");
    setDue("");
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Corrective Actions"
        description="Track corrective actions created from inspections, SafeScope recommendations, and user-entered work."
      />

      <section className="border-y border-slate-200 py-4">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-[#1D72B8]">
          Add Action
        </p>

        <div className="grid gap-3">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Describe the corrective action"
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-[#1D72B8]"
          />

          <div className="grid gap-3 sm:grid-cols-3">
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-[#1D72B8]"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>

            <input
              type="date"
              value={due}
              onChange={(event) => setDue(event.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-[#1D72B8]"
            />

            <button
              type="button"
              onClick={addAction}
              className="rounded-xl bg-[#1D72B8] px-5 py-3 text-sm font-black text-white"
            >
              Add Action
            </button>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200">
        {actions.length ? (
          actions.map((action, index) => {
            const isManualAction = index < manualActions.length;
            const isComplete = String(action.status).toLowerCase() === "completed";

            return (
              <div key={`${action.title}-${index}`} className="border-b border-slate-200 py-4 last:border-b-0">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className={`font-black ${isComplete ? "text-slate-400 line-through" : "text-slate-900"}`}>
                        {action.title}
                      </h2>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black uppercase text-slate-600">
                        {action.source}
                      </span>
                    </div>

                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      {action.location || "Workspace"} • Due: {action.due || "Not set"} • Status: {action.status}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${
                      String(action.priority).toLowerCase() === "critical"
                        ? "bg-red-100 text-red-700"
                        : String(action.priority).toLowerCase() === "high"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-slate-100 text-slate-700"
                    }`}>
                      {action.priority}
                    </span>

                    {isManualAction ? (
                      <select
                        value={action.status}
                        onChange={(event) => updateManualActionStatus(index, event.target.value)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-black text-slate-700 outline-none focus:border-[#1D72B8]"
                      >
                        <option>Open</option>
                        <option>In Progress</option>
                        <option>Blocked</option>
                        <option>Completed</option>
                      </select>
                    ) : (
                      <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-black text-slate-500">
                        Report-linked
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="py-5 text-sm font-semibold text-slate-500">
            No corrective actions available yet.
          </p>
        )}
      </section>
    </section>
  );
}
