"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-md space-y-5">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-black text-slate-900">Sign In</h1>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          Access your Sentinel Safety workspace.
        </p>

        <div className="mt-5 space-y-3">
          <input
            placeholder="Email"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold outline-none focus:border-[#1D72B8]"
          />

          <input
            placeholder="Password"
            type="password"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold outline-none focus:border-[#1D72B8]"
          />

          <Link
            href="/command-center"
            className="block rounded-xl bg-[#102A43] px-5 py-3 text-center text-sm font-black text-white"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}
