import Link from "next/link";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex flex-col">
            <span className="text-xl font-black tracking-tight">Sentinel Safety</span>
            <span className="text-xs font-semibold text-blue-700">See Risk. Prevent Harm.</span>
          </Link>

          <nav className="flex gap-4 text-sm font-bold text-slate-700">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/inspection">Inspection</Link>
            <Link href="/actions">Actions</Link>
            <Link href="/reports">Reports</Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
