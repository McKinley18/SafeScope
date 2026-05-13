export default function CommandCenterPage() {
  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Command Center</h1>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Operational safety intelligence, risk visibility, and action status.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Open Findings", "12"],
          ["Critical Risks", "3"],
          ["Overdue Actions", "5"],
          ["Reports This Month", "18"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-900">Highest Priority Items</h2>
          <div className="mt-4 space-y-3">
            {[
              ["Electrical exposure near conveyor", "Critical"],
              ["Missing guard on rotating shaft", "High"],
              ["Blocked emergency exit", "High"],
            ].map(([title, priority]) => (
              <div key={title} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-slate-900">{title}</p>
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
                    {priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-900">SafeScope Intelligence</h2>
          <div className="mt-4 rounded-xl bg-[#E8F4FF] p-4">
            <p className="font-black text-[#1D72B8]">Risk trend detected</p>
            <p className="mt-2 text-sm font-semibold text-slate-700">
              Recent findings show recurring energy-control and guarding exposure. Prioritize corrective actions and supervisor verification.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
