"use client";

import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function AppShell({ children }: Props) {
  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col">
      {/* HEADER */}
      <div className="w-full bg-[#102A43] flex items-center justify-center py-1">
        <Link href="/">
          <img
            src="/images/sentinel_transparent.png"
            alt="Sentinel Safety"
            className="w-[300px] h-[82px] object-contain cursor-pointer"
          />
        </Link>
      </div>

      {/* NAV */}
      <div className="w-full bg-white border-b border-slate-200 px-5 py-3 flex items-center gap-5">
        <Link href="/" className="text-[13px] font-black text-slate-600 hover:text-[#1D72B8]">
          Dashboard
        </Link>

        <Link href="/inspection" className="text-[13px] font-black text-[#1D72B8] underline">
          Inspections
        </Link>

        <Link href="/reports" className="text-[13px] font-black text-slate-600 hover:text-[#1D72B8]">
          Reports
        </Link>

        <Link href="/analytics" className="text-[13px] font-black text-slate-600 hover:text-[#1D72B8]">
          Analytics
        </Link>

        <Link href="/actions" className="text-[13px] font-black text-slate-600 hover:text-[#1D72B8]">
          Actions
        </Link>

        <div className="ml-auto">
          <div className="w-[34px] h-[34px] rounded-full bg-[#BFE3FF] flex items-center justify-center text-[13px] font-black text-slate-900">
            CM
          </div>
        </div>
      </div>

      {/* PAGE */}
      <main className="flex-1 p-[18px]">
        {children}
      </main>

      {/* FOOTER */}
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
