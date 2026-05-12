"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/inspection", label: "Inspections" },
  { href: "/reports", label: "Reports" },
  { href: "/analytics", label: "Analytics" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-900">
      <Link
        href="/"
        className="flex w-full items-center justify-center bg-[#102A43] px-4 py-2"
      >
        <div className="text-center">
          <div className="text-3xl font-black tracking-tight text-white">
            Sentinel Safety
          </div>
          <div className="text-sm font-bold text-[#BFE3FF]">
            See Risk. Prevent Harm.
          </div>
        </div>
      </Link>

      <nav className="flex items-center gap-4 border-b border-slate-200 bg-white px-4 py-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              isActive(item.href)
                ? "text-sm font-black text-[#1D72B8] underline decoration-[#1D72B8]"
                : "text-sm font-black text-[#52616F] hover:text-[#1D72B8]"
            }
          >
            {item.label}
          </Link>
        ))}

        <div className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#BFE3FF] text-sm font-black text-slate-900">
          CM
        </div>
      </nav>

      <main className="mx-auto w-full max-w-6xl px-5 py-5">{children}</main>

      <footer className="mt-8 border-t border-slate-200 bg-white px-4 py-6 text-center">
        <div className="flex justify-center gap-3 text-sm font-bold text-[#52616F]">
          <Link href="/about">About</Link>
          <span>|</span>
          <Link href="/legal">Legal</Link>
          <span>|</span>
          <Link href="/safescope">SafeScope</Link>
        </div>
        <div className="mx-auto my-4 h-px max-w-xl bg-slate-200" />
        <p className="text-xs font-semibold text-slate-500">
          © 2026 Sentinel Safety. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
