"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";

type ActionItem = {
  title: string;
  priority: string;
  status: string;
  due: string;
  source: "SafeScope" | "User";
};

const initialActions: ActionItem[] = [
  {
    title: "Verify guarding installed on conveyor drive",
    priority: "Critical",
    status: "Open",
    due: "Today",
    source: "SafeScope",
  },
  {
    title: "Confirm electrical panel cover is secured",
    priority: "High",
    status: "In Progress",
    due: "Tomorrow",
    source: "SafeScope",
  },
];

export default function ActionsPage() {
  const [actions, setActions] = useState<ActionItem[]>(initialActions);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [due, setDue] = useState("");

  function addAction() {
    if (!title.trim()) return;

    setActions((current) => [
      {
        title: title.trim(),
        priority,
        status: "Open",
        due: due || "Not set",
        source: "User",
      },
      ...current,
    ]);

    setTitle("");
    setPriority("Medium");
    setDue("");
  }

  return (
    <section className="space-y-7">
      <PageHeader
        title="Corrective Actions"
        description="Track SafeScope recommendations and add your own assigned corrective actions."
      />

      <section className="rounded-[24px] bg-[#0B1320] p-5">
        <p className="mb-2 text-[11px] font-black uppercase tracking-[1px] text-[#F97316]">
          Add Action
        </p>

        <div className="grid gap-3">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Describe the corrective action"
            className="rounded-xl border border-white/10 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              className="rounded-xl border border-white/10 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none"
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
              className="rounded-xl border border-white/10 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none"
            />
          </div>

          <button
            type="button"
            onClick={addAction}
            className="rounded-xl bg-[#1D72B8] px-5 py-3 text-sm font-black text-white"
          >
            Add Corrective Action
          </button>
        </div>
      </section>

      <section className="divide-y divide-slate-200 border-t border-slate-300">
        {actions.map((action, index) => (
          <div key={`${action.title}-${index}`} className="py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-black text-slate-900">{action.title}</h2>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black uppercase text-slate-600">
                    {action.source}
                  </span>
                </div>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Due: {action.due} • Status: {action.status}
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                {action.priority}
              </span>
            </div>
          </div>
        ))}
      </section>
    </section>
  );
}
