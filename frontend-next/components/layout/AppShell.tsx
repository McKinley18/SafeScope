"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const navItems = [
  { href: "/command-center", label: "Dashboard", activeRoots: ["/command-center", "/"] },
  { href: "/inspections", label: "Inspections", activeRoots: ["/inspections", "/inspection", "/inspection-cover", "/inspection-review", "/inspection-walkthrough"] },
  { href: "/reports", label: "Reports", activeRoots: ["/reports"] },
  { href: "/analytics", label: "Analytics", activeRoots: ["/analytics"] },
  { href: "/actions", label: "Actions", activeRoots: ["/actions"] },
];

export default function AppShell({ children }: Props) {
  const pathname = usePathname();

  const isActive = (roots: string[]) =>
    roots.some((root) =>
      root === "/" ? pathname === "/" : pathname === root || pathname.startsWith(root + "/")
    );

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col">
      <div className="w-full bg-[#102A43] flex items-center justify-center py-1">
        <Link href="/command-center">
          <img
            src="/images/sentinel_transparent.png"
            alt="Sentinel Safety"
            className="w-[300px] h-[82px] object-contain cursor-pointer"
          />
        </Link>
      </div>

      <div className="w-full bg-white border-b border-slate-200 px-5 py-3 flex items-center gap-5 overflow-x-auto">
        {navItems.map((item) => {
          const active = isActive(item.activeRoots);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap text-[13px] font-black ${
                active
                  ? "text-[#1D72B8] underline decoration-[#1D72B8]"
                  : "text-slate-600 hover:text-[#1D72B8]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}

        <div className="ml-auto">
          <div className="w-[34px] h-[34px] rounded-full bg-[#BFE3FF] flex items-center justify-center text-[13px] font-black text-slate-900">
            CM
          </div>
        </div>
      </div>

      <main className="flex-1 p-[18px]">{children}</main>

      <footer className="bg-[#102A43] px-[18px] pt-4 pb-4">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Link href="/about" className="text-white text-[13px] font-extrabold">
            About
          </Link>
          <span className="text-slate-400">|</span>
          <Link href="/legal" className="text-white text-[13px] font-extrabold">
            Legal
          </Link>
          <span className="text-slate-400">|</span>
          <Link href="/safescope" className="text-white text-[13px] font-extrabold">
            SafeScope
          </Link>
        </div>

        <div className="h-px bg-slate-500 opacity-50 mb-3" />

        <p className="text-center text-slate-300 text-xs font-semibold">
          © 2026 Sentinel Safety. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
