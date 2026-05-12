"use client";

import Link from "next/link";
import { Shield, LayoutDashboard, ClipboardList, BarChart3, FileText, CheckSquare } from "lucide-react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <aside className="w-72 border-r border-slate-800 bg-slate-900">
        <div className="flex items-center gap-3 border-b border-slate-800 p-6">
          <div className="rounded-xl bg-blue-600 p-3">
            <Shield size={24} />
          </div>
          <div>
            <div className="text-lg font-black">Sentinel Safety</div>
            <div className="text-xs font-semibold text-slate-400">See Risk. Prevent Harm.</div>
          </div>
        </div>

        <nav className="flex flex-col gap-2 p-4 text-sm font-bold">
          <Link href="/" className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-800">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/inspection" className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-800">
            <ClipboardList size={18} /> Inspection
          </Link>
          <Link href="/actions" className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-800">
            <CheckSquare size={18} /> Actions
          </Link>
          <Link href="/reports" className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-800">
            <FileText size={18} /> Reports
          </Link>
          <Link href="/analytics" className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-800">
            <BarChart3 size={18} /> Analytics
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
